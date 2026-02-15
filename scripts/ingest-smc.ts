import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import crypto from "crypto";
import pLimit from "p-limit";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const SITE_URL = (process.env.SMC_SITE_URL || "https://slatermediacompany.com").replace(
  /\/$/,
  ""
);

// Seed paths so we don’t rely on homepage links (great for SPAs / hash nav)
const SEED_PATHS = [
  "/",
  "/services",
  "/insider-access",
  "/#about",
  "/#showroom",
];

const EMBEDDING_MODEL = "text-embedding-3-small";

// Tuning knobs
const CONCURRENCY = Number(process.env.SMC_INGEST_CONCURRENCY || 4);
const MAX_PAGES = Number(process.env.SMC_INGEST_MAX_PAGES || 200);

// chunk sizes
const CHUNK_CHAR_LEN = 1800;
const CHUNK_OVERLAP = 250;

// Cap how many chunks we embed per page (prevents runaway cost)
const MAX_CHUNKS_PER_PAGE = Number(process.env.SMC_INGEST_MAX_CHUNKS_PER_PAGE || 30);

// Simple rate-limit / backoff for OpenAI 429s
const OPENAI_MAX_RETRIES = Number(process.env.SMC_OPENAI_MAX_RETRIES || 6);

console.log("ENV CHECK:", {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
  hasOpenAIKey: !!OPENAI_API_KEY,
});

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  throw new Error(
    "Missing env vars. Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY."
  );
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Force headers to match the working REST test
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  global: {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  },
});

function sha1(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function chunkText(text: string) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + CHUNK_CHAR_LEN, text.length);
    const chunk = text.slice(i, end);
    chunks.push(chunk);
    i = end - CHUNK_OVERLAP;
    if (i < 0) i = 0;
    if (end === text.length) break;
  }
  return chunks.map(normalizeText).filter(Boolean);
}

function shouldSkipUrl(u: string) {
  if (u.match(/\.(png|jpg|jpeg|gif|webp|svg|mp4|mov|pdf|zip|rar)$/i)) return true;
  if (u.startsWith("mailto:") || u.startsWith("tel:")) return true;
  if (u.includes("/api/")) return true;

  // Skip common non-content routes
  if (u.includes("/_next/")) return true;
  if (u.includes("/favicon")) return true;
  if (u.includes("/robots.txt")) return true;
  if (u.includes("/sitemap")) return true;

  return false;
}

function canonicalize(u: string) {
  try {
    const url = new URL(u, SITE_URL);
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isOpenAI429(err: any) {
  const msg = String(err?.message || "");
  return msg.includes("429") || msg.includes("quota") || err?.status === 429;
}

async function embedTextWithRetry(input: string) {
  let attempt = 0;
  while (true) {
    try {
      const emb = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input,
      });
      return emb.data[0].embedding;
    } catch (err: any) {
      attempt++;
      if (!isOpenAI429(err) || attempt > OPENAI_MAX_RETRIES) throw err;
      const backoff = Math.min(2000 * 2 ** (attempt - 1), 30000);
      console.warn(`OpenAI 429/backoff retry ${attempt}/${OPENAI_MAX_RETRIES} in ${backoff}ms`);
      await sleep(backoff);
    }
  }
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "SMC-KB-Crawler/1.0" },
  });

  // Treat missing pages as a normal skip (not a hard failure)
  if (res.status === 404) return null;

  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return null;

  return await res.text();
}

function extractMainTextAndLinks(html: string, pageUrl: string) {
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, noscript, iframe").remove();

  const title = $("title").text().trim() || null;

  const main = $("main");
  const raw = main.length ? main.text() : $("body").text();
  const text = normalizeText(raw);

  const links = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href) return;

    let abs = "";
    try {
      abs = new URL(href, pageUrl).toString();
    } catch {
      return;
    }

    if (!abs.startsWith(SITE_URL)) return;

    const canon = canonicalize(abs);
    if (!canon) return;
    if (shouldSkipUrl(canon)) return;

    links.add(canon);
  });

  return { title, text, links: [...links] };
}

async function upsertChunkAndEmbedding(opts: {
  source: string;
  title: string | null;
  content: string;
}) {
  const content_hash = sha1(`${opts.source}::${opts.content}`);

  const { data: chunkRow, error: chunkErr } = await supabase
    .from("smc_kb_chunks")
    .upsert(
      {
        source: opts.source,
        title: opts.title,
        content: opts.content,
        content_hash,
      },
      { onConflict: "content_hash" }
    )
    .select("id")
    .single();

  if (chunkErr) {
    console.error("Chunk upsert error full:", chunkErr);
    throw new Error(`Chunk upsert error: ${chunkErr.message}`);
  }

  const chunk_id = (chunkRow as any).id as number;

  const { data: existingEmb, error: checkErr } = await supabase
    .from("smc_kb_embeddings")
    .select("id")
    .eq("chunk_id", chunk_id)
    .limit(1);

  if (checkErr) throw new Error(`Embedding check error: ${checkErr.message}`);
  if (existingEmb && existingEmb.length) return;

  const embedding = await embedTextWithRetry(opts.content);

  const { error: embErr } = await supabase.from("smc_kb_embeddings").insert({
    chunk_id,
    embedding,
  });

  if (embErr) {
    console.error("Embedding insert error full:", embErr);
    throw new Error(`Embedding insert error: ${embErr.message}`);
  }
}

async function ingestPage(url: string) {
  const html = await fetchHtml(url);
  if (!html) return { url, title: null, chunks: 0, links: [], skipped: true };

  const { title, text, links } = extractMainTextAndLinks(html, url);

  if (!text || text.length < 300) {
    return { url, title, chunks: 0, links, skipped: true };
  }

  const chunks = chunkText(text).slice(0, MAX_CHUNKS_PER_PAGE);

  for (const content of chunks) {
    if (content.length < 200) continue;
    await upsertChunkAndEmbedding({ source: url, title, content });
  }

  return { url, title, chunks: chunks.length, links, skipped: false };
}

async function main() {
  console.log(`SMC crawl ingest starting…`);
  console.log(`SITE_URL: ${SITE_URL}`);
  console.log(`MAX_PAGES: ${MAX_PAGES}, CONCURRENCY: ${CONCURRENCY}`);

  const seen = new Set<string>();

  // Seed queue with known routes + homepage
  const queue: string[] = Array.from(
    new Set(SEED_PATHS.map((p) => canonicalize(new URL(p, SITE_URL).toString())).filter(Boolean))
  );

  const limit = pLimit(CONCURRENCY);

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  while (queue.length && seen.size < MAX_PAGES) {
    const batch: string[] = [];
    while (batch.length < CONCURRENCY && queue.length && seen.size < MAX_PAGES) {
      const next = queue.shift()!;
      if (seen.has(next)) continue;
      if (shouldSkipUrl(next)) continue;
      seen.add(next);
      batch.push(next);
    }

    if (!batch.length) break;

    const results = await Promise.allSettled(batch.map((u) => limit(() => ingestPage(u))));

    for (const r of results) {
      if (r.status === "fulfilled") {
        ok++;
        if (r.value.skipped) skipped++;

        console.log(
          `✅ ${r.value.url} (chunks: ${r.value.chunks}${r.value.skipped ? ", skipped" : ""})`
        );

        for (const link of r.value.links) {
          if (
            !seen.has(link) &&
            !queue.includes(link) &&
            seen.size + queue.length < MAX_PAGES * 3
          ) {
            queue.push(link);
          }
        }
      } else {
        fail++;
        console.error(`❌ ${r.reason?.message || r.reason}`);
      }
    }
  }

  console.log(`Done. visited=${seen.size}, ok=${ok}, skipped=${skipped}, fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});






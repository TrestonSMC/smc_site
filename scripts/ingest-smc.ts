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

const SITE_URL = (process.env.SMC_SITE_URL || "https://slatermediacompany.com").replace(/\/$/, "");

// ✅ Seed REAL routes
const SEED_PATHS = [
  "/",
  "/services",
  "/services/development",
  "/services/marketing",
  "/services/film-media",
  "/services/real-estate",
  "/showroom",
  "/about",
  "/insider-access",
  "/weddings",
];

const EMBEDDING_MODEL = "text-embedding-3-small";

const CONCURRENCY = Number(process.env.SMC_INGEST_CONCURRENCY || 4);
const MAX_PAGES = Number(process.env.SMC_INGEST_MAX_PAGES || 200);

const CHUNK_CHAR_LEN = 1800;
const CHUNK_OVERLAP = 250;

const MAX_CHUNKS_PER_PAGE = Number(process.env.SMC_INGEST_MAX_CHUNKS_PER_PAGE || 30);
const OPENAI_MAX_RETRIES = Number(process.env.SMC_OPENAI_MAX_RETRIES || 6);

const MIN_PAGE_TEXT_LEN = Number(process.env.SMC_INGEST_MIN_PAGE_TEXT_LEN || 120);
const MIN_CHUNK_LEN = Number(process.env.SMC_INGEST_MIN_CHUNK_LEN || 120);

console.log("ENV CHECK:", {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
  hasOpenAIKey: !!OPENAI_API_KEY,
});

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  throw new Error("Missing env vars. Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return null;

  return await res.text();
}

/* -------------------- Next.js data helpers -------------------- */
let NEXT_BUILD_ID: string | null = null;

function extractNextBuildId(html: string) {
  if (NEXT_BUILD_ID) return NEXT_BUILD_ID;
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m?.[1]) return null;
  try {
    const json = JSON.parse(m[1]);
    const buildId = json?.buildId;
    if (typeof buildId === "string" && buildId.length) {
      NEXT_BUILD_ID = buildId;
      return buildId;
    }
  } catch {}
  return null;
}

function extractStringsDeep(obj: any, out: string[] = [], depth = 0) {
  if (!obj || depth > 14) return out;

  if (typeof obj === "string") {
    const s = obj.trim();
    if (s.length >= 6 && s.length <= 6000) out.push(s);
    return out;
  }
  if (Array.isArray(obj)) {
    for (const v of obj) extractStringsDeep(v, out, depth + 1);
    return out;
  }
  if (typeof obj === "object") {
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase().includes("embedding")) continue;
      extractStringsDeep((obj as any)[k], out, depth + 1);
    }
  }
  return out;
}

function extractNextDataText(html: string) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m?.[1]) return "";
  try {
    const json = JSON.parse(m[1]);
    const pageProps = json?.props?.pageProps ?? json?.props ?? json;
    const strs = extractStringsDeep(pageProps);
    const uniq = Array.from(new Set(strs));
    return normalizeText(uniq.join(" • "));
  } catch {
    return "";
  }
}

// ✅ Fetch Next.js route data JSON: /_next/data/<buildId>/<route>.json
async function fetchNextDataJsonText(pageUrl: string, htmlForBuildId: string) {
  const buildId = extractNextBuildId(htmlForBuildId);
  if (!buildId) return "";

  let pathname = "";
  try {
    const u = new URL(pageUrl);
    pathname = u.pathname;
  } catch {
    return "";
  }

  // next data path rules:
  // "/" -> "/index.json"
  // "/services/development" -> "/services/development.json"
  const dataPath = pathname === "/" ? "/index" : pathname;
  const nextDataUrl = `${SITE_URL}/_next/data/${buildId}${dataPath}.json`;

  try {
    const res = await fetch(nextDataUrl, { headers: { "User-Agent": "SMC-KB-Crawler/1.0" } });
    if (!res.ok) return "";
    const json = await res.json();
    const pageProps = json?.pageProps ?? json?.props?.pageProps ?? json;
    const strs = extractStringsDeep(pageProps);
    const uniq = Array.from(new Set(strs));
    return normalizeText(uniq.join(" • "));
  } catch {
    return "";
  }
}

function extractMainTextAndLinks(html: string, pageUrl: string) {
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe").remove();

  const title = $("title").text().trim() || null;

  const main = $("main");
  const raw = main.length ? main.text() : $("body").text();
  let text = normalizeText(raw);

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

async function upsertChunkAndEmbedding(opts: { source: string; title: string | null; content: string }) {
  const content_hash = sha1(`${opts.source}::${opts.content}`);

  const { data: chunkRow, error: chunkErr } = await supabase
    .from("smc_kb_chunks")
    .upsert(
      { source: opts.source, title: opts.title, content: opts.content, content_hash },
      { onConflict: "content_hash" }
    )
    .select("id")
    .single();

  if (chunkErr) throw new Error(`Chunk upsert error: ${chunkErr.message}`);

  const chunk_id = (chunkRow as any).id as number;

  const { data: existingEmb, error: checkErr } = await supabase
    .from("smc_kb_embeddings")
    .select("id")
    .eq("chunk_id", chunk_id)
    .limit(1);

  if (checkErr) throw new Error(`Embedding check error: ${checkErr.message}`);
  if (existingEmb && existingEmb.length) return;

  const embedding = await embedTextWithRetry(opts.content);

  const { error: embErr } = await supabase.from("smc_kb_embeddings").insert({ chunk_id, embedding });
  if (embErr) throw new Error(`Embedding insert error: ${embErr.message}`);
}

async function ingestPage(url: string) {
  const html = await fetchHtml(url);
  if (!html) return { url, title: null, chunks: 0, links: [], skipped: true };

  const { title, text: domText, links } = extractMainTextAndLinks(html, url);

  // Start with DOM text
  let text = domText;

  // Fallback 1: __NEXT_DATA__ strings
  if (!text || text.length < MIN_PAGE_TEXT_LEN) {
    const nd = extractNextDataText(html);
    if (nd && nd.length > text.length) text = nd;
  }

  // Fallback 2: /_next/data/<buildId>/<route>.json strings (fixes CSR service pages)
  if (!text || text.length < MIN_PAGE_TEXT_LEN) {
    const jd = await fetchNextDataJsonText(url, html);
    if (jd && jd.length > text.length) text = jd;
  }

  if (!text || text.length < MIN_PAGE_TEXT_LEN) {
    return { url, title, chunks: 0, links, skipped: true };
  }

  const chunks = chunkText(text).slice(0, MAX_CHUNKS_PER_PAGE);

  for (const content of chunks) {
    if (content.length < MIN_CHUNK_LEN) continue;
    await upsertChunkAndEmbedding({ source: url, title, content });
  }

  return { url, title, chunks: chunks.length, links, skipped: false };
}

async function main() {
  console.log(`SMC crawl ingest starting…`);
  console.log(`SITE_URL: ${SITE_URL}`);
  console.log(`MAX_PAGES: ${MAX_PAGES}, CONCURRENCY: ${CONCURRENCY}`);
  console.log(`MIN_PAGE_TEXT_LEN: ${MIN_PAGE_TEXT_LEN}, MIN_CHUNK_LEN: ${MIN_CHUNK_LEN}`);

  const seen = new Set<string>();
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
        console.log(`✅ ${r.value.url} (chunks: ${r.value.chunks}${r.value.skipped ? ", skipped" : ""})`);

        for (const link of r.value.links) {
          if (!seen.has(link) && !queue.includes(link) && seen.size + queue.length < MAX_PAGES * 3) {
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









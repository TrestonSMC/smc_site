import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    },
  }
);

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userText = messages?.[messages.length - 1]?.content ?? "";

  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userText,
  });

  const { data: matches, error } = await supabase.rpc("smc_match_kb", {
    query_embedding: emb.data[0].embedding,
    match_count: 6,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sourcesText = (matches ?? [])
    .map((m: any, i: number) => {
      const title = m.title ? m.title : "Untitled";
      return `SOURCE ${i + 1}: ${title} (${m.source})\n${m.content}`;
    })
    .join("\n\n---\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are SMC Assist for Slater Media Company. Answer using ONLY the provided SOURCES. If not in SOURCES, say you don’t have that info and offer to connect them with SMC. Keep it concise and on-brand.",
      },
      { role: "system", content: `SOURCES:\n\n${sourcesText}` },
      ...messages,
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0]?.message?.content ?? "",
    sources: (matches ?? []).map((m: any) => ({
      source: m.source,
      title: m.title,
      similarity: m.similarity,
    })),
  });
}

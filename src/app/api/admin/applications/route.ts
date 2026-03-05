import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const mode = id ? "get" : "list";

    const scriptUrl = requiredEnv("GOOGLE_APPS_SCRIPT_URL");
    const token = requiredEnv("APPS_SCRIPT_TOKEN");

    const target = new URL(scriptUrl);
    target.searchParams.set("token", token);
    target.searchParams.set("mode", mode);
    if (id) target.searchParams.set("id", id);

    const res = await fetch(target.toString(), { method: "GET", cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      return NextResponse.json({ ok: false, error: json?.error || "Fetch failed" }, { status: 500 });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
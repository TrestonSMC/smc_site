import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "smc-media";

export async function POST(req: Request) {
  try {
    const adminKey = req.headers.get("x-admin-upload-key");

    if (!adminKey || adminKey !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const path = String(body.path || "").trim();

    if (!path) {
      return NextResponse.json({ error: "Missing upload path." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create signed upload URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: data.token, path });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Signed upload route failed." },
      { status: 500 }
    );
  }
}
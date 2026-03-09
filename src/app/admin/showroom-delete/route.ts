import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "smc-media";

function extractStoragePath(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function POST(req: Request) {
  try {
    const adminKey = req.headers.get("x-admin-upload-key");
    if (!adminKey || adminKey !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json({ error: "Missing item id." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: item, error: fetchErr } = await supabase
      .from("showroom_items")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const filesToDelete = [item.src, item.thumbnail]
      .filter(Boolean)
      .map(extractStoragePath)
      .filter(Boolean) as string[];

    if (filesToDelete.length) {
      const { error: storageErr } = await supabase.storage
        .from(BUCKET)
        .remove(filesToDelete);

      if (storageErr) {
        return NextResponse.json({ error: storageErr.message }, { status: 500 });
      }
    }

    const { error: deleteErr } = await supabase
      .from("showroom_items")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Delete failed." },
      { status: 500 }
    );
  }
}
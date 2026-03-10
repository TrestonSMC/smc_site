// src/app/api/admin/showroom-save/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const adminKey = req.headers.get("x-admin-upload-key");

    if (!adminKey || adminKey !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const subcategory = String(body.subcategory || "").trim();
    const kind = String(body.kind || "video").trim();
    const description = String(body.description || "").trim();
    const src = String(body.src || "").trim();
    const thumbnail = String(body.thumbnail || "").trim();
    const tags = Array.isArray(body.tags) ? body.tags : [];

    if (!title || !category || !subcategory || !src || !thumbnail) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const id = slugify(title);
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("showroom_items").upsert(
      {
        id,
        title,
        category,
        subcategory,
        kind,
        src,
        thumbnail,
        tags,
        description: description || null,
        is_published: true,
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      item: {
        id,
        title,
        category,
        subcategory,
        kind,
        src,
        thumbnail,
        tags,
        description,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Save failed." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "smc-media";
const VIDEO_FOLDER = "Videos";
const THUMB_FOLDER = "Thumbs";

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

    const form = await req.formData();

    const video = form.get("video") as File | null;
    const thumbnail = form.get("thumbnail") as File | null;

    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "").trim();
    const subcategory = String(form.get("subcategory") || "").trim();
    const kind = String(form.get("kind") || "video").trim();
    const description = String(form.get("description") || "").trim();
    const tagsRaw = String(form.get("tags") || "").trim();

    if (!video || !thumbnail || !title || !category || !subcategory) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const id = slugify(title);
    const videoExt = video.name.split(".").pop()?.toLowerCase() || "mp4";
    const thumbExt = "jpg";

    const videoPath = `${VIDEO_FOLDER}/${id}.${videoExt}`;
    const thumbPath = `${THUMB_FOLDER}/${id}.${thumbExt}`;

    const supabase = getSupabaseAdmin();

    const videoArrayBuffer = await video.arrayBuffer();
    const thumbArrayBuffer = await thumbnail.arrayBuffer();

    const { error: videoErr } = await supabase.storage
      .from(BUCKET)
      .upload(videoPath, videoArrayBuffer, {
        contentType: video.type || "video/mp4",
        upsert: true,
      });

    if (videoErr) {
      return NextResponse.json({ error: videoErr.message }, { status: 500 });
    }

    const { error: thumbErr } = await supabase.storage
      .from(BUCKET)
      .upload(thumbPath, thumbArrayBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (thumbErr) {
      return NextResponse.json({ error: thumbErr.message }, { status: 500 });
    }

    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const src = `${base}/storage/v1/object/public/${BUCKET}/${videoPath}`;
    const thumbnailUrl = `${base}/storage/v1/object/public/${BUCKET}/${thumbPath}`;

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const { error: insertErr } = await supabase.from("showroom_items").upsert(
      {
        id,
        title,
        category,
        subcategory,
        kind,
        src,
        thumbnail: thumbnailUrl,
        tags,
        description: description || null,
        is_published: true,
      },
      { onConflict: "id" }
    );

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
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
        thumbnail: thumbnailUrl,
        tags,
        description,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
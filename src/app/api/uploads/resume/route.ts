import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function safeSlug(s: string) {
  return (s || "role")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function safeName(s: string) {
  return (s || "applicant")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const form = await req.formData();

    const file = form.get("file");
    const roleSlug = safeSlug(String(form.get("roleSlug") || ""));
    const applicant = safeName(String(form.get("name") || ""));
    const email = safeName(String(form.get("email") || ""));

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    // Basic validation
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json({ ok: false, error: "File too large (max 10MB)" }, { status: 400 });
    }

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Only PDF, DOC, or DOCX allowed" },
        { status: 400 }
      );
    }

    const ext =
      file.name.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : file.name.toLowerCase().endsWith(".docx")
        ? "docx"
        : file.name.toLowerCase().endsWith(".doc")
        ? "doc"
        : "pdf";

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `${roleSlug}/${timestamp}-${applicant}-${email}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = "careers-resumes";

    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      return NextResponse.json({ ok: false, error: uploadErr.message }, { status: 500 });
    }

    // Public URL (bucket must be public)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      path,
      url: data.publicUrl,
    });
  } catch (err: any) {
    console.error("resume upload error:", err);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}

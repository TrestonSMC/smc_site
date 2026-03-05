// src/app/api/careers/apply/route.ts
import { NextResponse } from "next/server";
import { appendApplicationToSheet } from "@/lib/googleSheets";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeString(v: unknown, max = 4000) {
  const s = typeof v === "string" ? v : v == null ? "" : String(v);
  return s.trim().slice(0, max);
}

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const form = await req.json();

    const applicationId =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // Prefer a server-safe SITE_URL; fall back to NEXT_PUBLIC if you want.
    const siteUrl =
      (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

    const viewLink = `${siteUrl}/admin/applications/${applicationId}`;

    // Build the payload object that goes into the single "Payload" cell
    // Include whatever fields you want to render later on the View page.
    const payloadObj = {
      applicationId,
      viewLink,
      timestamp: new Date().toISOString(),
      name: safeString(form?.name, 200),
      email: safeString(form?.email, 200),
      phone: safeString(form?.phone, 80),
      role: safeString(form?.roleTitle ?? form?.roleSlug ?? "", 200),
      resumeUrl: safeString(form?.resumeUrl, 500),
      portfolio: safeString(form?.portfolio, 500),
      linkedin: safeString(form?.linkedin, 500),
      message: safeString(form?.message, 8000),
      // keep entire raw form too (optional)
      raw: form,
      meta: {
        ip:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          "",
        userAgent: req.headers.get("user-agent") || "",
        referer: req.headers.get("referer") || "",
      },
    };

    // This is EXACTLY what your sheet append should store:
    // Time Stamp | Name | Role | View Link | Applicant ID | Payload
    const sheetWritePayload = {
      token: requiredEnv("APPS_SCRIPT_TOKEN"),
      timestamp: payloadObj.timestamp,
      name: payloadObj.name,
      role: payloadObj.role,
      viewLink,
      applicationId,
      payload: JSON.stringify(payloadObj), // ✅ single-cell JSON
    };

    const out = await appendApplicationToSheet(sheetWritePayload);

    // ✅ Email hiring team
    // Env:
    // RESEND_API_KEY, CAREERS_EMAIL_FROM, CAREERS_EMAIL_TO (comma-separated)
    if (process.env.RESEND_API_KEY && process.env.CAREERS_EMAIL_FROM && process.env.CAREERS_EMAIL_TO) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const to = process.env.CAREERS_EMAIL_TO.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const subject = `SMC Career Inquiry: ${payloadObj.name}${payloadObj.role ? ` — ${payloadObj.role}` : ""}`;

      const html = `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.45">
          <h2>New Career Inquiry</h2>
          <p><b>Name:</b> ${escapeHtml(payloadObj.name)}</p>
          <p><b>Role:</b> ${escapeHtml(payloadObj.role)}</p>
          <p><b>Email:</b> ${escapeHtml(payloadObj.email)}</p>
          <p><b>Phone:</b> ${escapeHtml(payloadObj.phone)}</p>
          <p><b>Applicant ID:</b> ${escapeHtml(applicationId)}</p>
          <p><b>View Link:</b> <a href="${viewLink}" target="_blank" rel="noreferrer">${viewLink}</a></p>
          <hr/>
          <p><b>Resume:</b> ${linkify(payloadObj.resumeUrl)}</p>
          <p><b>Portfolio:</b> ${linkify(payloadObj.portfolio)}</p>
          <p><b>LinkedIn:</b> ${linkify(payloadObj.linkedin)}</p>
          ${payloadObj.message ? `<hr/><p><b>Message:</b></p><pre style="white-space: pre-wrap">${escapeHtml(payloadObj.message)}</pre>` : ""}
        </div>
      `;

      await resend.emails.send({
        from: process.env.CAREERS_EMAIL_FROM,
        to,
        replyTo: payloadObj.email || undefined,
        subject,
        html,
      });
    }

    return NextResponse.json({
      ok: true,
      applicationId: out?.applicationId ?? applicationId,
      viewLink,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string) {
  return (input || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function linkify(url: string) {
  const safe = escapeHtml(url || "");
  if (!safe) return "";
  const href = safe.startsWith("http") ? safe : `https://${safe}`;
  return `<a href="${href}" target="_blank" rel="noreferrer">${safe}</a>`;
}

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheets";

type WorkItem = {
  company?: string;
  title?: string;
  dates?: string;
  duties?: string;
  reasonForLeaving?: string;
};

export async function POST(req: Request) {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    const tab = process.env.GOOGLE_SHEETS_TAB_NAME || "Applications";

    if (!sheetId) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SHEETS_SHEET_ID in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // minimal validation (you can tighten later)
    const roleTitle = String(body.roleTitle || "").trim();
    const roleSlug = String(body.roleSlug || "").trim();

    if (!roleTitle || !roleSlug) {
      return NextResponse.json(
        { ok: false, error: "Missing roleTitle or roleSlug" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const workHistory: WorkItem[] = Array.isArray(body.workHistory)
      ? body.workHistory
      : [];

    // Flatten work history into one string for the sheet
    const workHistoryText =
      workHistory.length === 0
        ? ""
        : workHistory
            .map((w, i) => {
              const parts = [
                `#${i + 1}`,
                w.company ? `Company: ${w.company}` : null,
                w.title ? `Title: ${w.title}` : null,
                w.dates ? `Dates: ${w.dates}` : null,
                w.duties ? `Did: ${w.duties}` : null,
                w.reasonForLeaving ? `Left: ${w.reasonForLeaving}` : null,
              ].filter(Boolean);
              return parts.join(" | ");
            })
            .join("\n");

    // Append row (match your template columns as needed)
    const row = [
      now, // Timestamp
      roleTitle,
      roleSlug,

      String(body.firstName || ""),
      String(body.lastName || ""),
      String(body.email || ""),
      String(body.phone || ""),

      String(body.address1 || ""),
      String(body.address2 || ""),
      String(body.city || ""),
      String(body.state || ""),
      String(body.zip || ""),

      String(body.legallyAuthorizedUS ? "Yes" : "No"),
      String(body.age18Plus ? "Yes" : "No"),
      String(body.backgroundCheckConsent ? "Yes" : "No"),

      String(body.availabilityDate || ""), // ISO or readable
      String(body.desiredComp || ""), // wages (hourly/salary)

      String(body.professionalSummary || ""),
      String(body.whySMC || ""),

      String(body.braceletAdAnswer || ""),
      String(body.outsideSkillAnswer || ""),

      workHistoryText,

      // resume file info (store URL if you upload to storage)
      String(body.resumeUrl || ""),
    ];

    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tab}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

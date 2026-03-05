// src/lib/googleSheets.ts

export async function appendApplicationToSheet(data: {
  token: string;          // APPS_SCRIPT_TOKEN
  timestamp: string;
  name: string;
  role: string;
  viewLink: string;
  applicationId: string;
  payload: string;        // JSON string
}) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) throw new Error("Missing GOOGLE_APPS_SCRIPT_URL");

  // Optional: fail early if token missing (recommended)
  if (!data.token) throw new Error("Missing APPS_SCRIPT_TOKEN");

  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `Sheets append failed (status ${res.status})`);
  }

  return json as { ok: true; applicationId: string };
}



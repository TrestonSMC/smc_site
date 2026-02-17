import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing OAuth env vars",
        needed: [
          "GOOGLE_OAUTH_CLIENT_ID",
          "GOOGLE_OAUTH_CLIENT_SECRET",
          "GOOGLE_OAUTH_REDIRECT_URI",
        ],
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "Missing code param (?code=...)" },
      { status: 400 }
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2.getToken(code);

  return NextResponse.json({
    ok: true,
    message:
      "Copy refresh_token into GOOGLE_OAUTH_REFRESH_TOKEN in .env.local then restart dev server.",
    refresh_token: tokens.refresh_token || null,
    access_token_received: !!tokens.access_token,
    expiry_date: tokens.expiry_date || null,
    note:
      "If refresh_token is null, revoke the app access in your Google Account and run /api/google/oauth/start again (prompt=consent).",
  });
}

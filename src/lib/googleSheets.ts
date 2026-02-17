import { google } from "googleapis";

export function getSheetsClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI!;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN!;

  if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
    throw new Error(
      "Missing Google OAuth env vars. Need GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI, GOOGLE_OAUTH_REFRESH_TOKEN"
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2.setCredentials({ refresh_token: refreshToken });

  return google.sheets({ version: "v4", auth: oauth2 });
}

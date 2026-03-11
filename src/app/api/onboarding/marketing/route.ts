import nodemailer from "nodemailer";

function safe(value: unknown) {
  return String(value ?? "").trim();
}

function nl2br(value: string) {
  return value.replace(/\n/g, "<br />");
}

export async function POST(req: Request) {
  try {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      ONBOARDING_TO,
      ONBOARDING_FROM,
    } = process.env;

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !ONBOARDING_TO ||
      !ONBOARDING_FROM
    ) {
      return Response.json(
        { ok: false, error: "Missing SMTP env vars in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.verify();

    const businessName = safe(body.businessName);
    const contactName = safe(body.contactName);
    const email = safe(body.email);
    const phone = safe(body.phone);
    const website = safe(body.website);
    const logoLink = safe(body.logoLink);
    const brandAssets = safe(body.brandAssets);

    const instagramProfile = safe(body.instagramProfile);
    const instagramLogin = safe(body.instagramLogin);
    const instagramPassword = safe(body.instagramPassword);
    const instagramNotes = safe(body.instagramNotes);

    const facebookProfile = safe(body.facebookProfile);
    const facebookLogin = safe(body.facebookLogin);
    const facebookPassword = safe(body.facebookPassword);
    const facebookNotes = safe(body.facebookNotes);

    const tiktokProfile = safe(body.tiktokProfile);
    const tiktokLogin = safe(body.tiktokLogin);
    const tiktokPassword = safe(body.tiktokPassword);
    const tiktokNotes = safe(body.tiktokNotes);

    const youtubeProfile = safe(body.youtubeProfile);
    const youtubeLogin = safe(body.youtubeLogin);
    const youtubePassword = safe(body.youtubePassword);
    const youtubeNotes = safe(body.youtubeNotes);

    const linkedinProfile = safe(body.linkedinProfile);
    const linkedinLogin = safe(body.linkedinLogin);
    const linkedinPassword = safe(body.linkedinPassword);
    const linkedinNotes = safe(body.linkedinNotes);

    const otherPlatforms = safe(body.otherPlatforms);
    const audience = safe(body.audience);
    const competitors = safe(body.competitors);
    const goals = safe(body.goals);

    const subject = `[SMC Marketing Onboarding] - ${
  businessName || "Unknown Business"
}`;

    const text = `
NEW SMC MARKETING ONBOARDING

BUSINESS DETAILS
Business Name: ${businessName}
Primary Contact: ${contactName}
Email: ${email}
Phone: ${phone}
Website: ${website}
Logo Link: ${logoLink}
Brand Assets: ${brandAssets}

INSTAGRAM
Profile: ${instagramProfile}
Login: ${instagramLogin}
Password: ${instagramPassword}
Notes: ${instagramNotes}

FACEBOOK
Profile: ${facebookProfile}
Login: ${facebookLogin}
Password: ${facebookPassword}
Notes: ${facebookNotes}

TIKTOK
Profile: ${tiktokProfile}
Login: ${tiktokLogin}
Password: ${tiktokPassword}
Notes: ${tiktokNotes}

YOUTUBE
Profile: ${youtubeProfile}
Login: ${youtubeLogin}
Password: ${youtubePassword}
Notes: ${youtubeNotes}

LINKEDIN
Profile: ${linkedinProfile}
Login: ${linkedinLogin}
Password: ${linkedinPassword}
Notes: ${linkedinNotes}

OTHER PLATFORMS / NOTES
${otherPlatforms}

TARGET AUDIENCE
${audience}

COMPETITORS
${competitors}

GOALS
${goals}
    `.trim();

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111111;">
        <h1>New SMC Marketing Onboarding</h1>

        <h2>Business Details</h2>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Primary Contact:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Website:</strong> ${website}</p>
        <p><strong>Logo Link:</strong> ${logoLink}</p>
        <p><strong>Brand Assets:</strong><br />${nl2br(brandAssets)}</p>

        <h2>Instagram</h2>
        <p><strong>Profile:</strong> ${instagramProfile}</p>
        <p><strong>Login:</strong> ${instagramLogin}</p>
        <p><strong>Password:</strong> ${instagramPassword}</p>
        <p><strong>Notes:</strong><br />${nl2br(instagramNotes)}</p>

        <h2>Facebook</h2>
        <p><strong>Profile:</strong> ${facebookProfile}</p>
        <p><strong>Login:</strong> ${facebookLogin}</p>
        <p><strong>Password:</strong> ${facebookPassword}</p>
        <p><strong>Notes:</strong><br />${nl2br(facebookNotes)}</p>

        <h2>TikTok</h2>
        <p><strong>Profile:</strong> ${tiktokProfile}</p>
        <p><strong>Login:</strong> ${tiktokLogin}</p>
        <p><strong>Password:</strong> ${tiktokPassword}</p>
        <p><strong>Notes:</strong><br />${nl2br(tiktokNotes)}</p>

        <h2>YouTube</h2>
        <p><strong>Profile:</strong> ${youtubeProfile}</p>
        <p><strong>Login:</strong> ${youtubeLogin}</p>
        <p><strong>Password:</strong> ${youtubePassword}</p>
        <p><strong>Notes:</strong><br />${nl2br(youtubeNotes)}</p>

        <h2>LinkedIn</h2>
        <p><strong>Profile:</strong> ${linkedinProfile}</p>
        <p><strong>Login:</strong> ${linkedinLogin}</p>
        <p><strong>Password:</strong> ${linkedinPassword}</p>
        <p><strong>Notes:</strong><br />${nl2br(linkedinNotes)}</p>

        <h2>Other Platforms / Notes</h2>
        <p>${nl2br(otherPlatforms)}</p>

        <h2>Target Audience</h2>
        <p>${nl2br(audience)}</p>

        <h2>Competitors</h2>
        <p>${nl2br(competitors)}</p>

        <h2>Goals</h2>
        <p>${nl2br(goals)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: ONBOARDING_FROM,
      to: ONBOARDING_TO,
      subject,
      text,
      html,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Onboarding email error:", error);

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send onboarding email.",
      },
      { status: 500 }
    );
  }
}
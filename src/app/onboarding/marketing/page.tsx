 "use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Instagram,
  Facebook,
  Music2,
  Youtube,
  Linkedin,
  Sparkles,
  LockKeyhole,
  Target,
  ChevronRight,
} from "lucide-react";

/* -------------------- utils -------------------- */
function cx(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 backdrop-blur">
    {children}
  </span>
);

type PlatformKey =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin";

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  logoLink: string;
  brandAssets: string;

  instagramProfile: string;
  instagramLogin: string;
  instagramPassword: string;
  instagramNotes: string;

  facebookProfile: string;
  facebookLogin: string;
  facebookPassword: string;
  facebookNotes: string;

  tiktokProfile: string;
  tiktokLogin: string;
  tiktokPassword: string;
  tiktokNotes: string;

  youtubeProfile: string;
  youtubeLogin: string;
  youtubePassword: string;
  youtubeNotes: string;

  linkedinProfile: string;
  linkedinLogin: string;
  linkedinPassword: string;
  linkedinNotes: string;

  otherPlatforms: string;
  audience: string;
  competitors: string;
  goals: string;
};

const initialForm: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  logoLink: "",
  brandAssets: "",

  instagramProfile: "",
  instagramLogin: "",
  instagramPassword: "",
  instagramNotes: "",

  facebookProfile: "",
  facebookLogin: "",
  facebookPassword: "",
  facebookNotes: "",

  tiktokProfile: "",
  tiktokLogin: "",
  tiktokPassword: "",
  tiktokNotes: "",

  youtubeProfile: "",
  youtubeLogin: "",
  youtubePassword: "",
  youtubeNotes: "",

  linkedinProfile: "",
  linkedinLogin: "",
  linkedinPassword: "",
  linkedinNotes: "",

  otherPlatforms: "",
  audience: "",
  competitors: "",
  goals: "",
};

function platformIcon(platform: PlatformKey) {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "tiktok":
      return <Music2 className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}

function prettyPlatform(platform: PlatformKey) {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "tiktok":
      return "TikTok";
    case "youtube":
      return "YouTube";
    case "linkedin":
      return "LinkedIn";
    default:
      return platform;
  }
}

function PlatformCard({
  platform,
  form,
  onChange,
}: {
  platform: PlatformKey;
  form: FormState;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#29C3FF]/35 focus:bg-white/[0.055]";
  const textareaClass =
    "w-full min-h-[96px] rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#29C3FF]/35 focus:bg-white/[0.055]";

  const profileKey = `${platform}Profile` as keyof FormState;
  const loginKey = `${platform}Login` as keyof FormState;
  const passwordKey = `${platform}Password` as keyof FormState;
  const notesKey = `${platform}Notes` as keyof FormState;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.22)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/78">
            {platformIcon(platform)}
            {prettyPlatform(platform)}
          </div>

          <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
            Access
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/78">
              Profile Link / Handle
            </label>
            <input
              type="text"
              name={String(profileKey)}
              value={String(form[profileKey])}
              onChange={onChange}
              className={inputClass}
              placeholder={`@brand or ${prettyPlatform(platform)} link`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/78">
              Login Email / Username
            </label>
            <input
              type="text"
              name={String(loginKey)}
              value={String(form[loginKey])}
              onChange={onChange}
              className={inputClass}
              placeholder={`Login for ${prettyPlatform(platform)}`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/78">
              Password
            </label>
            <input
              type="text"
              name={String(passwordKey)}
              value={String(form[passwordKey])}
              onChange={onChange}
              className={inputClass}
              placeholder={`Password for ${prettyPlatform(platform)}`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/78">
              Notes / 2FA / Recovery
            </label>
            <textarea
              name={String(notesKey)}
              value={String(form[notesKey])}
              onChange={onChange}
              className={textareaClass}
              placeholder="2FA steps, backup email, phone verification, business manager notes, or anything else we should know"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingOnboardingPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      const res = await fetch("/api/onboarding/marketing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send onboarding email.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Onboarding submit error:", err);
      setError("Could not send onboarding email.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#29C3FF]/35 focus:bg-white/[0.055]";
  const textareaClass =
    "w-full min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#29C3FF]/35 focus:bg-white/[0.055]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.05),transparent_34%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.04),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_40%)]" />
        <div className="absolute -top-40 left-[12%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(41,195,255,0.08),transparent_62%)] blur-3xl" />
        <div className="absolute -top-32 right-[8%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_64%)] blur-3xl" />
        <div className="absolute -bottom-40 left-[35%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(41,195,255,0.04),transparent_66%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_36%,rgba(0,0,0,0.38)_70%,rgba(0,0,0,0.72)_100%)]" />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-28 md:pt-32">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <div className="flex flex-wrap gap-3">
                <Pill>
                  <Sparkles className="h-4 w-4 text-white/75" />
                  SMC Marketing
                </Pill>
                <Pill>
                  <LockKeyhole className="h-4 w-4 text-white/75" />
                  Client Onboarding
                </Pill>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                Marketing onboarding,
                <span className="block text-white/72">
                  simplified for a smoother handoff.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-white/62">
                Share your business info, platforms, and account access so SMC
                can get aligned on strategy, content, and execution.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.26)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/45">
                      BUSINESS DETAILS
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Brand foundations
                    </h2>
                    <p className="mt-2 text-sm text-white/58">
                      The core information we need before building anything out.
                    </p>
                  </div>
                  <Building2 className="hidden h-6 w-6 text-white/28 sm:block" />
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Business name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Primary Contact Name
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Main point of contact"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/78">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="name@business.com"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/78">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Logo Link
                    </label>
                    <input
                      type="text"
                      name="logoLink"
                      value={form.logoLink}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Drive, Dropbox, or direct asset link"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Brand Assets
                    </label>
                    <textarea
                      name="brandAssets"
                      value={form.brandAssets}
                      onChange={handleChange}
                      className={textareaClass}
                      placeholder="Colors, fonts, style guide, content folders, existing campaigns, brand references, etc."
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.26)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/45">
                      SOCIALS + ACCESS
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Platforms and credentials
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/58">
                      Each platform keeps its profile, login, password, and notes
                      together so it stays organized.
                    </p>
                  </div>
                  <Globe className="hidden h-6 w-6 text-white/28 sm:block" />
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <PlatformCard
                    platform="instagram"
                    form={form}
                    onChange={handleChange}
                  />
                  <PlatformCard
                    platform="facebook"
                    form={form}
                    onChange={handleChange}
                  />
                  <PlatformCard
                    platform="tiktok"
                    form={form}
                    onChange={handleChange}
                  />
                  <PlatformCard
                    platform="youtube"
                    form={form}
                    onChange={handleChange}
                  />
                  <div className="lg:col-span-2">
                    <PlatformCard
                      platform="linkedin"
                      form={form}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-white/78">
                    Other Platforms / Notes
                  </label>
                  <textarea
                    name="otherPlatforms"
                    value={form.otherPlatforms}
                    onChange={handleChange}
                    className={textareaClass}
                    placeholder="Google Business Profile, Yelp, X, Threads, Pinterest, Snapchat, Meta Business Manager notes, or anything else not covered above"
                  />
                </div>
              </motion.section>

              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.26)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/45">
                      STRATEGY INFO
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Goals and market direction
                    </h2>
                    <p className="mt-2 text-sm text-white/58">
                      The info that helps SMC move faster and make better
                      decisions.
                    </p>
                  </div>
                  <Target className="hidden h-6 w-6 text-white/28 sm:block" />
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Target Audience
                    </label>
                    <textarea
                      name="audience"
                      value={form.audience}
                      onChange={handleChange}
                      className={textareaClass}
                      placeholder="Who are you trying to reach? Include age, location, buying habits, interests, customer type, and pain points."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Competitors
                    </label>
                    <textarea
                      name="competitors"
                      value={form.competitors}
                      onChange={handleChange}
                      className={textareaClass}
                      placeholder="Who do you compete with, or what brands/accounts do you admire?"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      Goals
                    </label>
                    <textarea
                      name="goals"
                      value={form.goals}
                      onChange={handleChange}
                      className={textareaClass}
                      placeholder="Leads, sales, awareness, traffic, bookings, content consistency, branding, ad growth, etc."
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.26)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/45">
                      READY TO SUBMIT
                    </div>
                    <p className="mt-2 text-sm text-white/58">
                      Please review your information to ensure everything is correct. The Slater Media Company team will follow up with you within 24 hours.
                    </p>

                    {error ? (
                      <p className="mt-3 text-sm text-red-400">{error}</p>
                    ) : null}

                    {submitted ? (
                      <p className="mt-3 text-sm text-emerald-400">
                        Onboarding sent successfully.
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cx(
                      "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition",
                      "hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                  >
                    {submitting ? "Sending..." : "Submit Onboarding"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.section>
            </form>
          </motion.div>
        </div>
      </section>

      <footer className="relative pb-10 text-center text-sm text-white/32">
        © {new Date().getFullYear()} Slater Media Company — Marketing Onboarding
      </footer>
    </main>
  );
}
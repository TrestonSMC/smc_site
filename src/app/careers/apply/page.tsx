// src/app/careers/apply/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Sparkles,
  User,
  Link2,
  Briefcase,
  ShieldCheck,
  Plus,
  Trash2,
  Upload,
  MapPin,
  BadgeDollarSign,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getRole } from "@/lib/careers";

type WorkHistoryItem = {
  company: string;
  title: string;
  whatDidYouDo: string;
  reasonForLeaving: string;
};

type CompensationType = "" | "Hourly" | "Salary";

type AppForm = {
  roleTitle: string;
  roleSlug: string;

  // basics
  name: string;
  email: string;
  phone: string;

  // address
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;

  // compensation
  desiredCompType: CompensationType;
  desiredRate: string; // keep as text for now
  desiredRateNotes: string;

  // links
  portfolio: string;
  socials: string;
  reel: string;
  extraLinks: string;

  // work history
  workHistory: WorkHistoryItem[];

  // experience
  professionalExperience: string;
  availabilityStart: string; // YYYY-MM-DD
  availabilityNotes: string;

  // why
  whySlater: string;

  // creative prompt
  braceletAd: string;

  // growth question
  outsideSkillSet: string;

  // legal
  legallyAbleUS: boolean;
  over18: boolean;
  infoAccurate: boolean;
  consentToContact: boolean;
  sponsorshipNeeded: boolean;

  // spam trap
  website: string;
};

const DRAFT_KEY = "smc_careers_app_draft_v6";

const fieldBase =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 " +
  "placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition";

const labelBase = "text-xs font-semibold tracking-[0.18em] text-white/60 uppercase";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function normalizeUrl(v: string) {
  const s = (v || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

function isUrlLike(v: string) {
  const s = (v || "").trim();
  if (!s) return true;
  try {
    new URL(normalizeUrl(s));
    return true;
  } catch {
    return false;
  }
}

function bytesToMb(n: number) {
  return Math.round((n / (1024 * 1024)) * 10) / 10;
}

function splitName(full: string) {
  const s = full.trim().replace(/\s+/g, " ");
  if (!s) return { firstName: "", lastName: "" };
  const parts = s.split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function buildDesiredComp(type: CompensationType, rate: string, notes: string) {
  const t = type ? `${type}` : "";
  const r = rate?.trim() ? rate.trim() : "";
  const n = notes?.trim() ? notes.trim() : "";
  const chunks = [t && r ? `${t}: ${r}` : t || r, n ? `Notes: ${n}` : ""].filter(Boolean);
  return chunks.join(" • ");
}

export default function CareersApplyPage() {
  const sp = useSearchParams();

  // ✅ Next.js 16 safe access
  const slugFromUrl = useMemo(() => sp.get("slug") || "", [sp]);
  const roleFromUrl = useMemo(() => sp.get("role") || "", [sp]);

  const decodedSlug = useMemo(
    () => (slugFromUrl ? decodeURIComponent(slugFromUrl) : ""),
    [slugFromUrl]
  );

  const roleObj = useMemo(() => (decodedSlug ? getRole(decodedSlug) : null), [decodedSlug]);

  const displayRoleTitle = useMemo(() => {
    if (roleObj?.title) return roleObj.title;
    if (roleFromUrl) return decodeURIComponent(roleFromUrl);
    return "SMC Role";
  }, [roleObj?.title, roleFromUrl]);

  const displayRoleSlug = useMemo(() => {
    if (roleObj?.slug) return roleObj.slug;
    return decodedSlug || "";
  }, [roleObj?.slug, decodedSlug]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // resume upload state
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadErr, setResumeUploadErr] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>(""); // saved link for sheet
  const [resumeName, setResumeName] = useState<string>(""); // track to avoid wrong reuse

  const [form, setForm] = useState<AppForm>({
    roleTitle: displayRoleTitle,
    roleSlug: displayRoleSlug,

    name: "",
    email: "",
    phone: "",

    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",

    desiredCompType: "",
    desiredRate: "",
    desiredRateNotes: "",

    portfolio: "",
    socials: "",
    reel: "",
    extraLinks: "",

    workHistory: [{ company: "", title: "", whatDidYouDo: "", reasonForLeaving: "" }],

    professionalExperience: "",
    availabilityStart: "",
    availabilityNotes: "",

    whySlater: "",

    braceletAd: "",
    outsideSkillSet: "",

    legallyAbleUS: false,
    over18: false,
    infoAccurate: false,
    consentToContact: false,
    sponsorshipNeeded: false,

    website: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [sentMsg, setSentMsg] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Keep role synced (smart)
  useEffect(() => {
    setForm((p) => ({
      ...p,
      roleTitle: displayRoleTitle,
      roleSlug: displayRoleSlug,
    }));
  }, [displayRoleTitle, displayRoleSlug]);

  // Load draft (resume file cannot be stored in localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<AppForm>;
      setForm((p) => ({
        ...p,
        ...draft,
        roleTitle: displayRoleTitle,
        roleSlug: displayRoleSlug,
      }));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mark = (k: string) => setTouched((p) => ({ ...p, [k]: true }));

  const update =
    (k: keyof AppForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [k]: (e.target as any).value }));
    };

  const toggle =
    (k: keyof AppForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.checked }));
    };

  const updateWork = (idx: number, key: keyof WorkHistoryItem, value: string) => {
    setForm((p) => {
      const next = [...p.workHistory];
      next[idx] = { ...next[idx], [key]: value };
      return { ...p, workHistory: next };
    });
  };

  const addWork = () => {
    setForm((p) => ({
      ...p,
      workHistory: [...p.workHistory, { company: "", title: "", whatDidYouDo: "", reasonForLeaving: "" }],
    }));
  };

  const removeWork = (idx: number) => {
    setForm((p) => {
      const next = p.workHistory.filter((_, i) => i !== idx);
      return {
        ...p,
        workHistory: next.length ? next : [{ company: "", title: "", whatDidYouDo: "", reasonForLeaving: "" }],
      };
    });
  };

  // Resume validation (UI + API also validates)
  const resumeValidation = useMemo(() => {
    if (!resumeFile) return { ok: true, msg: "" };

    const maxBytes = 10 * 1024 * 1024;
    if (resumeFile.size > maxBytes) return { ok: false, msg: "Resume must be 10MB or smaller." };

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const name = resumeFile.name.toLowerCase();
    const extOk = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
    const typeOk = !resumeFile.type || allowed.includes(resumeFile.type);

    if (!extOk || !typeOk) return { ok: false, msg: "Only PDF, DOC, or DOCX resumes are allowed." };

    return { ok: true, msg: "" };
  }, [resumeFile]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !isEmail(form.email)) e.email = "Enter a valid email.";

    // require work samples
    if (!form.portfolio.trim()) e.portfolio = "Portfolio/work samples link is required.";
    else if (!isUrlLike(form.portfolio)) e.portfolio = "Enter a valid portfolio link.";

    if (form.socials && !isUrlLike(form.socials)) e.socials = "Enter a valid link.";
    if (form.reel && !isUrlLike(form.reel)) e.reel = "Enter a valid link.";
    if (form.extraLinks && !isUrlLike(form.extraLinks)) e.extraLinks = "Enter a valid link.";

    // legal required
    if (!form.legallyAbleUS) e.legallyAbleUS = "Required.";
    if (!form.over18) e.over18 = "Required.";
    if (!form.infoAccurate) e.infoAccurate = "Required.";
    if (!form.consentToContact) e.consentToContact = "Required.";

    // resume optional, but if selected must be valid
    if (resumeFile && !resumeValidation.ok) e.resume = resumeValidation.msg || "Invalid resume.";

    // soft prompt
    if (!form.availabilityStart.trim()) e.availabilityStartSoft = "Add a start date if you can.";

    return e;
  }, [form, resumeFile, resumeValidation]);

  const canSubmit = useMemo(() => {
    return (
      !errors.name &&
      !errors.email &&
      !errors.portfolio &&
      !errors.socials &&
      !errors.reel &&
      !errors.extraLinks &&
      !errors.legallyAbleUS &&
      !errors.over18 &&
      !errors.infoAccurate &&
      !errors.consentToContact &&
      !errors.resume
    );
  }, [errors]);

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setResumeFile(null);
    setResumeUrl("");
    setResumeName("");
    setResumeUploadErr(null);
  };

  async function uploadResumeIfNeeded() {
    setResumeUploadErr(null);
    if (!resumeFile) return "";

    if (!resumeValidation.ok) throw new Error(resumeValidation.msg || "Invalid resume file.");

    // ✅ only reuse if we uploaded THIS exact filename
    if (resumeUrl && resumeName === resumeFile.name) return resumeUrl;

    setResumeUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", resumeFile);
      fd.append("roleSlug", form.roleSlug || "role");
      fd.append("name", form.name || "applicant");
      fd.append("email", form.email || "");

      const up = await fetch("/api/uploads/resume", { method: "POST", body: fd });
      const upData = await up.json().catch(() => null);

      if (!up.ok || !upData?.ok || !upData?.url) {
        throw new Error(upData?.error || "Resume upload failed.");
      }

      setResumeUrl(upData.url);
      setResumeName(resumeFile.name);
      return upData.url as string;
    } finally {
      setResumeUploading(false);
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);
    setSentMsg("");
    setResumeUploadErr(null);

    setTouched((p) => ({
      ...p,
      name: true,
      email: true,
      portfolio: true,
      legallyAbleUS: true,
      over18: true,
      infoAccurate: true,
      consentToContact: true,
      resume: true,
    }));

    // honeypot
    if (form.website.trim().length) {
      setSent("ok");
      setSentMsg("Received.");
      return;
    }

    if (!canSubmit) {
      setSent("err");
      setSentMsg("Fix required fields and try again.");
      return;
    }

    setSending(true);
    try {
      // 1) Upload resume first (if provided)
      let uploadedResumeUrl = "";
      if (resumeFile) uploadedResumeUrl = await uploadResumeIfNeeded();

      // 2) Build payload for /api/careers/apply
      const { firstName, lastName } = splitName(form.name);

      const desiredComp = buildDesiredComp(form.desiredCompType, form.desiredRate, form.desiredRateNotes);

      const workHistoryMapped = form.workHistory
        .filter(
          (w) =>
            w.company.trim() ||
            w.title.trim() ||
            w.whatDidYouDo.trim() ||
            w.reasonForLeaving.trim()
        )
        .map((w) => ({
          company: w.company.trim(),
          title: w.title.trim(),
          dates: "", // not collected right now
          duties: w.whatDidYouDo.trim(),
          reasonForLeaving: w.reasonForLeaving.trim(),
        }));

      const payload = {
        // role
        roleTitle: `Slater Media Company — ${form.roleTitle}`,
        roleSlug: form.roleSlug,

        // basics
        name: form.name,
        firstName,
        lastName,
        email: form.email,
        phone: form.phone,

        // address
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        state: form.state,
        zip: form.zip,

        // legal
        legallyAuthorizedUS: form.legallyAbleUS,
        age18Plus: form.over18,
        infoAccurate: form.infoAccurate,
        consentToContact: form.consentToContact,
        sponsorshipNeeded: form.sponsorshipNeeded,
        backgroundCheckConsent: true,

        // availability
        availabilityDate: form.availabilityStart,
        availabilityNotes: form.availabilityNotes,

        // comp
        desiredComp,

        // links
        portfolio: normalizeUrl(form.portfolio),
        socials: normalizeUrl(form.socials),
        reel: normalizeUrl(form.reel),
        extraLinks: normalizeUrl(form.extraLinks),

        // experience + why
        professionalSummary: form.professionalExperience,
        whySMC: form.whySlater,

        // prompts
        braceletAdAnswer: form.braceletAd,
        outsideSkillAnswer: form.outsideSkillSet,

        // work history
        workHistory: workHistoryMapped,

        // resume
        resumeUrl: uploadedResumeUrl || "",
        resumeFilename: resumeFile?.name || "",
      };

      // 3) Submit to backend (Sheets append)
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Submission failed (Sheets).");
      }

      setSent("ok");
      setSentMsg("Application received — we’ll review and follow up.");
      clearDraft();

      // reset form
      setForm((p) => ({
        ...p,
        name: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        desiredCompType: "",
        desiredRate: "",
        desiredRateNotes: "",
        portfolio: "",
        socials: "",
        reel: "",
        extraLinks: "",
        workHistory: [{ company: "", title: "", whatDidYouDo: "", reasonForLeaving: "" }],
        professionalExperience: "",
        availabilityStart: "",
        availabilityNotes: "",
        whySlater: "",
        braceletAd: "",
        outsideSkillSet: "",
        legallyAbleUS: false,
        over18: false,
        infoAccurate: false,
        consentToContact: false,
        sponsorshipNeeded: false,
        website: "",
      }));

      setResumeFile(null);
      setResumeUrl("");
      setResumeName("");
      setTouched({});
    } catch (err: any) {
      const msg = err?.message || "Didn’t send — try again.";
      setSent("err");
      setSentMsg(msg);
      if (msg.toLowerCase().includes("resume") || msg.toLowerCase().includes("upload")) {
        setResumeUploadErr(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const CardShell =
    "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md " +
    "shadow-[0_26px_120px_rgba(0,0,0,0.55)]";

  const EdgeGlow = () => (
    <div className="pointer-events-none absolute inset-0 rounded-3xl">
      <div className="absolute -inset-[14px] rounded-[30px] opacity-45 blur-3xl bg-[radial-gradient(1100px_circle_at_45%_30%,rgba(179,106,255,0.20),transparent_60%)]" />
      <div className="absolute -inset-[14px] rounded-[30px] opacity-40 blur-3xl bg-[radial-gradient(1100px_circle_at_60%_55%,rgba(0,180,255,0.18),transparent_62%)]" />
      <div className="absolute -inset-[14px] rounded-[30px] opacity-30 blur-3xl bg-[radial-gradient(1100px_circle_at_40%_75%,rgba(255,196,92,0.12),transparent_64%)]" />
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
    </div>
  );

  const Hairline = () => (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-70 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
  );

  const InlineError = ({ show, msg }: { show: boolean; msg?: string }) =>
    show && msg ? <div className="mt-2 text-xs text-rose-200/90">{msg}</div> : null;

  const CheckRow = ({
    id,
    checked,
    onChange,
    label,
    required,
    hint,
    errKey,
  }: {
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    required?: boolean;
    hint?: string;
    errKey?: string;
  }) => (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={() => (errKey ? mark(errKey) : null)}
          className="mt-1 h-4 w-4 accent-white"
        />
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">
            {label} {required ? <span className="text-white/60">(required)</span> : null}
          </div>
          {hint ? <div className="mt-1 text-sm text-white/65">{hint}</div> : null}
          {errKey ? (
            <InlineError
              show={!!touched[errKey] && !!(errors as any)[errKey]}
              msg={(errors as any)[errKey]}
            />
          ) : null}
        </div>
      </label>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href="/careers" className="text-sm text-white/65 hover:text-white/90 transition">
            ← Back to Careers
          </Link>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.09] transition"
            >
              <Clipboard className="h-4 w-4" />
              Save draft
            </button>
            <button
              type="button"
              onClick={() => {
                clearDraft();
                setSent(null);
                setSentMsg("");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-black/30 transition"
            >
              Clear draft
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* FORM */}
          <div className="lg:col-span-3">
            <div className={CardShell}>
              <EdgeGlow />
              <Hairline />

              <div className="relative p-7 sm:p-9">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                      APPLICATION
                    </div>

                    <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
                      Slater Media Company — {form.roleTitle}
                    </h1>

                    {form.roleSlug ? (
                      <div className="mt-2 text-xs text-white/55">Role: {form.roleSlug}</div>
                    ) : null}

                    <p className="mt-3 text-sm text-white/70 leading-relaxed">
                      We’re hiring at a high standard. Real work samples are required for review.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/80">
                    <Sparkles className="h-4 w-4" />
                    SMC Recruiting
                  </div>
                </div>

                {/* honeypot */}
                <input
                  value={form.website}
                  onChange={update("website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <form onSubmit={submit} className="mt-7 space-y-8">
                  {/* Basics */}
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Basics</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          value={form.name}
                          onChange={update("name")}
                          onBlur={() => mark("name")}
                          placeholder="Full name *"
                          className={fieldBase}
                        />
                        <InlineError show={!!touched.name && !!errors.name} msg={errors.name} />
                      </div>

                      <div>
                        <input
                          value={form.email}
                          onChange={update("email")}
                          onBlur={() => mark("email")}
                          placeholder="Email *"
                          className={fieldBase}
                        />
                        <InlineError show={!!touched.email && !!errors.email} msg={errors.email} />
                      </div>

                      <input
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="Phone (optional)"
                        className={fieldBase}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Address</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <input value={form.address1} onChange={update("address1")} placeholder="Street address" className={fieldBase} />
                      <input value={form.address2} onChange={update("address2")} placeholder="Apt / Suite (optional)" className={fieldBase} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input value={form.city} onChange={update("city")} placeholder="City" className={fieldBase} />
                        <input value={form.state} onChange={update("state")} placeholder="State" className={fieldBase} />
                        <input value={form.zip} onChange={update("zip")} placeholder="Zip" className={fieldBase} />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Resume</div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <div className="text-sm font-semibold text-white/90">Upload your resume</div>
                          <div className="mt-1 text-sm text-white/65">
                            PDF/DOC/DOCX • up to 10MB • we’ll store it and link it in the sheet.
                          </div>
                        </div>

                        <label
                          className={`inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                            resumeUploading
                              ? "bg-black/25 text-white/70 opacity-70 cursor-not-allowed"
                              : "bg-white/[0.06] text-white/85 hover:bg-white/[0.09]"
                          }`}
                        >
                          {resumeUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading…
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Choose file
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            disabled={resumeUploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setResumeFile(f);
                              setResumeUrl("");
                              setResumeName("");
                              setResumeUploadErr(null);
                              if (f) mark("resume");
                            }}
                          />
                        </label>
                      </div>

                      {resumeFile ? (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                            <div className="text-sm text-white/80 truncate">
                              <span className="font-semibold text-white/90">Selected:</span>{" "}
                              {resumeFile.name}{" "}
                              <span className="text-white/50">({bytesToMb(resumeFile.size)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setResumeFile(null);
                                setResumeUrl("");
                                setResumeName("");
                                setResumeUploadErr(null);
                              }}
                              className="rounded-full border border-white/12 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-black/30 transition"
                            >
                              Remove
                            </button>
                          </div>

                          <InlineError show={!!touched.resume && !!errors.resume} msg={errors.resume} />

                          {resumeUrl ? (
                            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-semibold">Resume uploaded</div>
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1 block text-emerald-100/90 underline underline-offset-4 break-all"
                                >
                                  {resumeUrl}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {resumeUploadErr ? (
                            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 flex items-start gap-2">
                              <AlertTriangle className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-semibold">Resume upload failed</div>
                                <div className="mt-1 text-rose-100/90">{resumeUploadErr}</div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-4 text-xs text-white/55">
                          Resume is optional, but recommended. Your portfolio link is still required.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Work Samples */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Work Samples</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <input
                          value={form.portfolio}
                          onChange={update("portfolio")}
                          onBlur={() => mark("portfolio")}
                          placeholder="Portfolio / Work Samples Link *"
                          className={fieldBase}
                        />
                        <InlineError show={!!touched.portfolio && !!errors.portfolio} msg={errors.portfolio} />
                        <div className="mt-2 text-xs text-white/55">
                          Real work only. If you don’t include samples, we won’t review the application.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            value={form.socials}
                            onChange={update("socials")}
                            onBlur={() => mark("socials")}
                            placeholder="Social link (IG / TikTok / LinkedIn)"
                            className={fieldBase}
                          />
                          <InlineError show={!!touched.socials && !!errors.socials} msg={errors.socials} />
                        </div>

                        <div>
                          <input
                            value={form.reel}
                            onChange={update("reel")}
                            onBlur={() => mark("reel")}
                            placeholder="Best single link (reel / case study)"
                            className={fieldBase}
                          />
                          <InlineError show={!!touched.reel && !!errors.reel} msg={errors.reel} />
                        </div>
                      </div>

                      <div>
                        <input
                          value={form.extraLinks}
                          onChange={update("extraLinks")}
                          onBlur={() => mark("extraLinks")}
                          placeholder="Extra links (optional)"
                          className={fieldBase}
                        />
                        <InlineError show={!!touched.extraLinks && !!errors.extraLinks} msg={errors.extraLinks} />
                      </div>
                    </div>
                  </div>

                  {/* Desired Compensation */}
                  <div>
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Desired Compensation</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={form.desiredCompType}
                        onChange={update("desiredCompType")}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25 focus:bg-black/28 transition"
                      >
                        <option value="">Select</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Salary">Salary</option>
                      </select>

                      <input
                        value={form.desiredRate}
                        onChange={update("desiredRate")}
                        placeholder={form.desiredCompType === "Salary" ? "Annual ($)" : "Rate ($/hr)"}
                        className={fieldBase}
                      />

                      <input
                        value={form.desiredRateNotes}
                        onChange={update("desiredRateNotes")}
                        placeholder="Notes (range, negotiable, etc.)"
                        className={fieldBase}
                      />
                    </div>
                  </div>

                  {/* Work History */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Work History</div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {form.workHistory.map((w, idx) => (
                        <div key={idx} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-semibold text-white/90">Position #{idx + 1}</div>
                            <button
                              type="button"
                              onClick={() => removeWork(idx)}
                              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-black/30 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              value={w.company}
                              onChange={(e) => updateWork(idx, "company", e.target.value)}
                              placeholder="Company / Studio"
                              className={fieldBase}
                            />
                            <input
                              value={w.title}
                              onChange={(e) => updateWork(idx, "title", e.target.value)}
                              placeholder="Title / Role"
                              className={fieldBase}
                            />
                          </div>

                          <textarea
                            value={w.whatDidYouDo}
                            onChange={(e) => updateWork(idx, "whatDidYouDo", e.target.value)}
                            placeholder="What did you do? What did you deliver? What level were you operating at?"
                            rows={3}
                            className={fieldBase + " mt-3 resize-none"}
                          />

                          <textarea
                            value={w.reasonForLeaving}
                            onChange={(e) => updateWork(idx, "reasonForLeaving", e.target.value)}
                            placeholder="Reason for leaving"
                            rows={2}
                            className={fieldBase + " mt-3 resize-none"}
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addWork}
                        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.09] transition"
                      >
                        <Plus className="h-4 w-4" />
                        Add more
                      </button>
                    </div>
                  </div>

                  {/* Availability & Fit */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Availability & Fit</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <textarea
                        value={form.professionalExperience}
                        onChange={update("professionalExperience")}
                        placeholder="Describe your professional experience at a high level. What kind of work have you consistently shipped? What standard do you hold yourself to?"
                        rows={4}
                        className={fieldBase + " resize-none"}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            value={form.availabilityStart}
                            onChange={update("availabilityStart")}
                            onBlur={() => mark("availabilityStart")}
                            className={fieldBase}
                          />
                          {form.availabilityStart.trim().length === 0 ? (
                            <div className="mt-2 text-xs text-white/55">{(errors as any).availabilityStartSoft}</div>
                          ) : null}
                        </div>

                        <input
                          value={form.availabilityNotes}
                          onChange={update("availabilityNotes")}
                          placeholder="Availability (days/times, hours/week)"
                          className={fieldBase}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Why Slater */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Why</div>
                    </div>

                    <textarea
                      value={form.whySlater}
                      onChange={update("whySlater")}
                      placeholder="Why Slater Media Company? Why this role? What makes you a top-tier fit?"
                      rows={4}
                      className={fieldBase + " mt-4 resize-none"}
                    />
                  </div>

                  {/* Creative question */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Creative</div>
                    </div>

                    <textarea
                      value={form.braceletAd}
                      onChange={update("braceletAd")}
                      placeholder='If we told you to go create an ad selling bracelets what would that look like? (Theme, tone, style, etc...)'
                      rows={5}
                      className={fieldBase + " mt-4 resize-none"}
                    />
                    <div className="mt-2 text-xs text-white/55">Keep it structured: concept → hook → visuals → pacing → CTA.</div>
                  </div>

                  {/* Outside skill set */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Execution</div>
                    </div>

                    <textarea
                      value={form.outsideSkillSet}
                      onChange={update("outsideSkillSet")}
                      placeholder="Describe a situation where you took on a task outside your current skill set. What steps did you take to bridge the gap and deliver a high-quality result?"
                      rows={5}
                      className={fieldBase + " mt-4 resize-none"}
                    />
                  </div>

                  {/* Legal */}
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-white/70" />
                      <div className={labelBase}>Work Authorization</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <CheckRow
                        id="legallyAbleUS"
                        checked={form.legallyAbleUS}
                        onChange={toggle("legallyAbleUS")}
                        label="I am legally authorized to work in the United States."
                        required
                        errKey="legallyAbleUS"
                      />
                      <CheckRow
                        id="over18"
                        checked={form.over18}
                        onChange={toggle("over18")}
                        label="I am at least 18 years old."
                        required
                        errKey="over18"
                      />
                      <CheckRow
                        id="infoAccurate"
                        checked={form.infoAccurate}
                        onChange={toggle("infoAccurate")}
                        label="I confirm the information I provided is accurate."
                        required
                        errKey="infoAccurate"
                      />
                      <CheckRow
                        id="consentToContact"
                        checked={form.consentToContact}
                        onChange={toggle("consentToContact")}
                        label="I consent to being contacted about this application."
                        required
                        errKey="consentToContact"
                        hint="Email/phone contact for scheduling and follow-ups."
                      />
                      <CheckRow
                        id="sponsorshipNeeded"
                        checked={form.sponsorshipNeeded}
                        onChange={toggle("sponsorshipNeeded")}
                        label="I will require visa sponsorship now or in the future."
                        hint="This does not automatically disqualify you, but we need to know."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={sending || resumeUploading}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/40 transition disabled:opacity-60 disabled:hover:bg-black/25"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit application
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    {sent === "ok" && (
                      <div className="inline-flex items-center gap-2 text-sm text-white/85">
                        <CheckCircle2 className="h-5 w-5" />
                        {sentMsg || "Application received."}
                      </div>
                    )}

                    {sent === "err" && (
                      <div className="inline-flex items-center gap-2 text-sm text-white/80">
                        <AlertTriangle className="h-5 w-5" />
                        {sentMsg || "Didn’t send — check required fields and try again."}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-white/55 leading-relaxed">
                    By submitting, you agree to be contacted about this role. No spam — ever.
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-2">
            <div className={CardShell}>
              <EdgeGlow />
              <Hairline />

              <div className="relative p-7 sm:p-9">
                <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                  EXPECTATIONS
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">We’re hiring the best.</h2>

                <ul className="mt-5 space-y-3 text-sm text-white/75">
                  <li>• Real work samples required (client work / campaigns)</li>
                  <li>• Consistency + taste + speed</li>
                  <li>• Strong communication and reliability</li>
                  <li>• Ability to take feedback and execute clean revisions</li>
                </ul>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-sm font-semibold text-white/90">Tip</div>
                  <div className="mt-2 text-sm text-white/70 leading-relaxed">
                    Make your first link your strongest proof. We review quality fast.
                  </div>
                </div>

                <div className="mt-7">
                  <Link
                    href="/careers"
                    className="inline-flex items-center justify-center w-full rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/85 hover:bg-white/[0.09] transition"
                  >
                    Back to roles →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-white/50">
              Drafts save locally on this device. Resume files don’t persist in drafts.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}







// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Clock, ArrowRight, Crown, Star } from "lucide-react";
import { media } from "@/lib/media";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const fadeUp = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

  const stagger = isMobile
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

  const cards = {
    featured: {
      eyebrow: "NEW AT SMC",
      title: "Featured Client Video",
      desc:
        "A featured cut that shows the standard — story, pacing, and premium edits you can preview right here.",
      meta: "Tap to play • Sound on",
      videoSrc: media.featuredClient,
      thumb: "/images/thumb-featured-video.jpg",
    },
    grid: [
      {
        type: "Web Development",
        eyebrow: "AT SMC • DOZERS",
        title: "DozersGrill.com",
        desc: "A live build focused on speed, clean UX, and a restaurant-first brand position.",
        meta: "Live client website",
        actionLabel: "Visit site",
        href: "https://dozersgrill.com",
        thumb: "/images/thumb-dozers.jpg",
        kind: "link" as const,
      },
      {
        type: "App Development",
        eyebrow: "SMC PRODUCT",
        title: "SMC App (App Store)",
        desc: "A client portal for updates, approvals, and a clean way to keep projects moving.",
        meta: "Preview • App Store",
        actionLabel: "Open App Store",
        href: "https://apps.apple.com/us/app/slater-media-co/id6754180869",
        videoThumbSrc: media.smcAppPreview,
        mobileThumb: "/images/thumb-smc-app.jpg",
        kind: "videoThumbLink" as const,
      },
    ],
  };

  // ===================== CARD SYSTEM =====================
  const ring =
    "border border-white/12 shadow-[0_18px_75px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]";

  const cardShell =
    "group relative overflow-hidden rounded-3xl bg-white/[0.06] backdrop-blur-md " +
    "transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.075] " +
    "hover:shadow-[0_28px_120px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.12)] " +
    ring;

  const EdgeGlow = () => (
    <div className="pointer-events-none absolute inset-0 rounded-3xl">
      <div className="absolute -inset-[14px] rounded-[30px] blur-3xl opacity-45 bg-[radial-gradient(1100px_circle_at_45%_30%,rgba(179,106,255,0.20),transparent_60%)]" />
      <div className="absolute -inset-[14px] rounded-[30px] blur-3xl opacity-40 bg-[radial-gradient(1100px_circle_at_60%_55%,rgba(0,180,255,0.18),transparent_62%)]" />
      <div className="absolute -inset-[14px] rounded-[30px] blur-3xl opacity-30 bg-[radial-gradient(1100px_circle_at_40%_75%,rgba(255,196,92,0.12),transparent_64%)]" />
      <div className="absolute inset-0 rounded-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.10)]" />
    </div>
  );

  const Hairline = () => (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-70 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
  );

  // ===================== FEATURED =====================
  const FeaturedCard = ({ item }: { item: typeof cards.featured }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const fgRef = useRef<HTMLVideoElement | null>(null);

    const close = () => {
      if (fgRef.current) {
        try {
          fgRef.current.pause();
          fgRef.current.currentTime = 0;
        } catch {}
      }
      setIsPlaying(false);
      setErr(null);
    };

    const play = async () => {
      setErr(null);
      setIsPlaying(true);

      requestAnimationFrame(async () => {
        try {
          if (fgRef.current) {
            fgRef.current.muted = false;
            fgRef.current.volume = 1;
            await fgRef.current.play();
          }
        } catch {
          setErr("Couldn’t start video. Confirm URL is public + MP4 is H.264/AAC.");
        }
      });
    };

    return (
      <motion.div variants={fadeUp} className={`${cardShell} mx-auto w-full max-w-4xl`}>
        <EdgeGlow />
        <Hairline />

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {!isPlaying ? (
            <>
              <Image
                src={item.thumb}
                alt={`${item.title} thumbnail`}
                fill
                className="object-cover scale-[1.02] group-hover:scale-[1.05] transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/5" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-white/75">{item.meta}</div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={play}
                  className="rounded-full border border-white/15 bg-black/35 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/50 transition shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.55)]"
                >
                  ▶ Play
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                <video
                  ref={fgRef}
                  src={item.videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-full max-w-full rounded-2xl border border-white/10 bg-black/20 object-contain shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
                  onError={() => setErr("Video failed to load. Confirm bucket is PUBLIC.")}
                />
              </div>

              <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/85">
                    NOW PLAYING
                  </span>

                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-black/55 transition"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative p-6 sm:p-7">
          <p className="text-sm md:text-[15px] leading-relaxed text-white/75">{item.desc}</p>

          {err && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
              <div className="font-semibold text-white/90">Playback issue</div>
              <div className="mt-1">{err}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const CompactCard = ({ item }: { item: (typeof cards.grid)[number] }) => {
    const isVideoThumbLink = item.kind === "videoThumbLink";

    return (
      <motion.div variants={fadeUp} className={cardShell}>
        <EdgeGlow />
        <Hairline />

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {isVideoThumbLink ? (
            isMobile ? (
              <Image
                src={(item as any).mobileThumb || "/images/thumb-smc-app.jpg"}
                alt={`${item.title} preview`}
                fill
                className="object-cover"
              />
            ) : (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                disablePictureInPicture
              >
                <source src={(item as any).videoThumbSrc} type="video/mp4" />
              </video>
            )
          ) : (
            <Image src={(item as any).thumb} alt={`${item.title} thumbnail`} fill className="object-cover" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-black/5" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-lg font-semibold tracking-tight text-white">{item.title}</div>
            <div className="mt-1 text-sm text-white/75">{(item as any).meta}</div>
          </div>
        </div>

        <div className="relative p-6">
          <p className="text-sm leading-relaxed text-white/75">{(item as any).desc}</p>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/85">{(item as any).actionLabel}</div>
            <a
              href={(item as any).href}
              target={(item as any).href.startsWith("http") ? "_blank" : undefined}
              rel={(item as any).href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-black/45 transition"
            >
              Open →
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===================== PORTL content loader =====================
  const [portlContent, setPortlContent] = useState<any>(null);

  const getDeep = (obj: any, path: string) =>
    path.split(".").reduce((acc: any, k) => (acc ? acc[k] : undefined), obj);

  const portlText = (path: string, fallback: string) => {
    const v = getDeep(portlContent, path);
    return typeof v === "string" && v.trim().length ? v : fallback;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/portl/content", { cache: "no-store" });
        const data = await res.json();
        setPortlContent(data?.content || null);
      } catch {
        setPortlContent(null);
      }
    };
    load();
  }, []);

  // ===================== FORM =====================
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    website: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);

    if (form.website.trim().length) {
      setSent("ok");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
        }),
      });

      if (!res.ok) throw new Error("bad status");
      setSent("ok");
      setForm({ name: "", email: "", company: "", message: "", website: "" });
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  };

  return (
    // ✅ bg-transparent so nebula can be seen
    <main className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* ✅ Nebula behind page content (visible because main is transparent) */}
      <NebulaFull />

      <div className="relative z-10">
        {/* ===================== HERO (video only at top section) ===================== */}
        <section className="relative overflow-hidden">
          <HeroVideoTopOnly isMobile={isMobile} heroSrc={media.heroVideo} />

          {/* ✅ don’t fade to a solid color (that hides nebula) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black/30" />

          <div className="relative z-10 min-h-[calc(82vh-84px)] flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
              <motion.div variants={stagger} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
                <motion.h1
                  variants={fadeUp}
                  className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
                >
                  {portlText("hero.headline", "The Creatives Express")}
                </motion.h1>

                <motion.div
                  variants={fadeUp}
                  className="mt-3 text-xs sm:text-sm font-semibold tracking-[0.28em] text-white/70 uppercase"
                >
                  Slater Media Company
                </motion.div>

                <motion.p variants={fadeUp} className="mt-5 text-base md:text-lg text-white/80 leading-relaxed">
                  {portlText("hero.body", "Websites, apps, and cinematic media — built clean, fast, and premium.")}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-7 flex justify-center gap-3 flex-wrap">
                  <Link
                    href="/showroom"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/45 transition"
                  >
                    View Showroom <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-6 py-3 text-sm font-semibold text-white/85 hover:bg-black/30 transition"
                  >
                    Services
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===================== NEW AT SMC ===================== */}
        <section className="relative pb-10 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <motion.div variants={fadeUp} className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-xs font-semibold tracking-[0.22em] text-white/60">NEW AT SMC</div>
                  <h3 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">Latest drops</h3>
                </div>

                <Link
                  href="/showroom"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-black/30 transition"
                >
                  Full showroom <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="mt-6 flex justify-center">
                <FeaturedCard item={cards.featured} />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompactCard item={cards.grid[0]} />
                <CompactCard item={cards.grid[1]} />
              </div>
            </motion.div>
          </div>
        </section>

{/* ===================== INSIDER ACCESS (Multicolor Edge Glow) ===================== */}
<section className="relative pb-10 sm:pb-12">
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="relative rounded-3xl">

      {/* 🔥 Multicolor OUTER glow (less blue, more premium blend) */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[36px] blur-2xl opacity-75"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(179,106,255,0.55), rgba(255,196,92,0.45), rgba(0,220,170,0.35), rgba(120,80,255,0.45), rgba(179,106,255,0.55))",
        }}
      />

      {/* GLASS CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[0_26px_120px_rgba(0,0,0,0.55)]">

        {/* subtle inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_26px_90px_rgba(0,0,0,0.62)]">
                <Crown className="h-5 w-5 text-white/95" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-white/95">
                    Insider Access
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/90">
                    <Star className="h-3.5 w-3.5" />
                    VIP
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/90">
                    PRIVATE
                  </span>
                </div>

                <div className="mt-1 text-sm text-white/80 max-w-xl">
                  Early previews, private drops, and internal tools — for clients who want first access.
                </div>
              </div>
            </div>

            <Link
              href="/insider-access"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/40 transition shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              Join Access <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                t: "First Looks",
                d: "See new builds + edits before they hit the showroom.",
              },
              {
                t: "Private Drops",
                d: "Invite-only templates, presets, and internal tools.",
              },
              {
                t: "Priority Replies",
                d: "Faster turnaround when you’re ready to move.",
              },
            ].map((p) => (
              <div
                key={p.t}
                className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_16px_55px_rgba(0,0,0,0.35)]"
              >
                <div className="text-sm font-semibold text-white/92">
                  {p.t}
                </div>
                <div className="mt-1 text-sm text-white/75 leading-relaxed">
                  {p.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

        {/* ===================== CONTACT ===================== */}
        <section id="contact" className="relative pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className={`${cardShell} relative`}>
              <EdgeGlow />
              <Hairline />

              <div className="relative p-7 sm:p-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.22em] text-white/60">CONTACT</div>
                    <h3 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">
                      Let’s build something clean.
                    </h3>
                    <p className="mt-3 max-w-3xl text-white/75 leading-relaxed">
                      Websites, apps, content, brand — send the details and we’ll reply with next steps.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm text-white/80">
                      <Clock className="h-4 w-4" />
                      Mon–Fri • 8:00 AM – 5:00 PM
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/40 transition"
                    >
                      Services <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <form onSubmit={submit} className="mt-7 grid gap-3">
                  <input
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Name"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition"
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Email"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition"
                    />
                  </div>

                  <input
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Company (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition"
                  />

                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="What are we building? (Website, app, content, brand, etc.)"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition"
                  />

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-black/40 transition disabled:opacity-60 disabled:hover:bg-black/25"
                    >
                      {sending ? "Sending…" : "Send request"}
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    {sent === "ok" && <div className="text-sm text-white/80">Received — we’ll hit you back soon.</div>}
                    {sent === "err" && <div className="text-sm text-white/80">Didn’t send — try again in a minute.</div>}
                  </div>
                </form>

                <div className="mt-5 text-xs text-white/55 leading-relaxed">
                  By submitting, you agree to be contacted about your project. No spam — ever.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-8 text-center text-white/55 text-sm">
          © {new Date().getFullYear()} Slater Media Company — The Creatives Express
        </footer>
      </div>
    </main>
  );
}

function NebulaFull() {
  return (
    // ✅ Put nebula at z-0 (NOT -z-10), then content is z-10 above it.
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />

      <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.35),transparent_22%),radial-gradient(circle_at_90%_40%,rgba(255,255,255,0.25),transparent_18%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.20),transparent_20%)]" />

      <div className="absolute -top-72 left-[6%] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_64%)] blur-3xl" />
      <div className="absolute -top-64 right-[4%] h-[1020px] w-[1020px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_66%)] blur-3xl" />
      <div className="absolute -bottom-80 left-[28%] h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_68%)] blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.05),transparent_48%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />
    </div>
  );
}

function HeroVideoTopOnly({ isMobile, heroSrc }: { isMobile: boolean; heroSrc: string }) {
  const vRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isMobile) return;
    const v = vRef.current;
    if (!v) return;

    const t = setTimeout(() => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    }, 60);

    return () => clearTimeout(t);
  }, [isMobile]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {!isMobile ? (
        <>
          <video
            ref={vRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.jpg"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            controls={false}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.55] contrast-[1.08] saturate-[1.18]"
          >
            <source src={heroSrc} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/35" />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/55" />
      )}

      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
    </div>
  );
}














































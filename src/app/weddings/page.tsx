
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HardDrive,
  Phone,
  Sparkles,
  Users,
  Film,
} from "lucide-react";

type Package = {
  name: string;
  nickname: string;
  price: number;
  badge?: string;
  highlight?: boolean;
  summary: string;
  features: { icon: ReactNode; label: string }[];
  included: string[];
};

// ONLY VIDEO ON THE PAGE — HERO CARD
const HERO_VIDEO_URL =
  "https://zzfbfgouvouiwhjcncga.supabase.co/storage/v1/object/public/smc-media/Videos/mccord-wedding-teaser.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// Autoplay the hero video when available.
function useForcePlay(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        await video.play();
      } catch {
        // Autoplay may be blocked by the browser.
      }
    };

    void tryPlay();
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, [videoRef, enabled]);
}

const packages: Package[] = [
  {
    name: "Cinematic Trailer",
    nickname: "Trailer Package",
    price: 1200,
    summary: "A punchy, cinematic highlight built for sharing.",
    features: [
      { icon: <Users className="h-4 w-4" />, label: "2 videographers" },
      { icon: <Clock className="h-4 w-4" />, label: "8 hour cap" },
      { icon: <Sparkles className="h-4 w-4" />, label: "Cinematic trailer" },
    ],
    included: [
      "Cinematic trailer (highlight film)",
      "8 hours of coverage",
      "2 videographers",
    ],
  },
  {
    name: "Bronze Bowtie",
    nickname: "Essentials",
    price: 1500,
    summary: "Simple, clean coverage for the full story of the day.",
    features: [
      { icon: <Users className="h-4 w-4" />, label: "1 videographer" },
      { icon: <Clock className="h-4 w-4" />, label: "8 hour cap" },
      { icon: <Film className="h-4 w-4" />, label: "Wedding film" },
    ],
    included: [
      "Wedding film",
      "8 hours of coverage",
      "1 videographer",
    ],
  },
  {
    name: "Silver Cuff Link",
    nickname: "Most Popular",
    price: 2500,
    badge: "Best Value",
    highlight: true,
    summary: "More angles, more moments, plus everything delivered on a drive.",
    features: [
      { icon: <Users className="h-4 w-4" />, label: "2 videographers" },
      { icon: <Clock className="h-4 w-4" />, label: "8 hour cap" },
      { icon: <Film className="h-4 w-4" />, label: "Wedding film" },
      { icon: <HardDrive className="h-4 w-4" />, label: "Drive + raw footage" },
    ],
    included: [
      "Wedding film",
      "8 hours of coverage",
      "2 videographers",
      "Hard drive with final deliverables",
      "Raw footage included",
    ],
  },
  {
    name: "Golden Tux",
    nickname: "Premium",
    price: 4000,
    badge: "No Hour Cap",
    summary: "The full cinematic treatment—everything, with zero time limits.",
    features: [
      { icon: <Users className="h-4 w-4" />, label: "2 videographers" },
      { icon: <Sparkles className="h-4 w-4" />, label: "No hourly cap" },
      { icon: <Film className="h-4 w-4" />, label: "Full wedding film" },
      { icon: <Sparkles className="h-4 w-4" />, label: "Cinematic teaser" },
    ],
    included: [
      "No hourly cap",
      "Cinematic teaser",
      "Full wedding film",
      "Individual dance cuts",
      "Everything included in Silver Cuff Link",
    ],
  },
].sort((a, b) => a.price - b.price);

function Stars() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  const items = [
    { top: "12%", left: "8%", delay: 0.3, dur: 2.4, size: 220 },
    { top: "28%", left: "68%", delay: 0.8, dur: 2.1, size: 260 },
    { top: "52%", left: "22%", delay: 1.2, dur: 2.7, size: 240 },
    { top: "66%", left: "80%", delay: 1.6, dur: 2.2, size: 260 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s, i) => (
        <motion.div
          key={i}
          className="absolute opacity-0"
          style={{ top: s.top, left: s.left }}
          initial={{ opacity: 0, x: -40, y: -20 }}
          animate={{
            opacity: [0, 0.7, 0],
            x: [-40, s.size],
            y: [-20, s.size * 0.35],
          }}
          transition={{
            delay: s.delay,
            duration: s.dur,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeOut",
          }}
        >
          <div className="h-[2px] w-[260px] -rotate-[20deg] rounded-full bg-gradient-to-r from-white/0 via-white/70 to-white/0 blur-[0.3px]" />
        </motion.div>
      ))}
    </div>
  );
}

export default function WeddingsPage() {
  const reduceMotion = useReducedMotion();
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const [heroOk, setHeroOk] = useState(true);

  const playHero = !reduceMotion && heroOk;

  useForcePlay(heroVideoRef, playHero);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* STATIC FULL-PAGE NEBULA BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.04),transparent_45%)]" />

        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />

        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />

        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* ANIMATED STARS */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Stars />
      </div>

      {/* TOP NAVIGATION */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-white/80 transition hover:text-white"
          >
            <span className="text-sm">←</span>
            <span className="text-sm font-semibold tracking-wide">
              Back to Services
            </span>
          </Link>

          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            View Packages
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* HERO CARD — VIDEO ONLY HERE */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative isolate min-h-[480px] overflow-hidden rounded-3xl border border-white/15 bg-neutral-900 shadow-[0_30px_110px_rgba(0,0,0,0.55)] md:min-h-[560px]"
        >
          {/* Video fills the hero card behind text */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {playHero ? (
              <video
                ref={heroVideoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setHeroOk(false)}
              >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(179,106,255,0.25),transparent_55%),radial-gradient(circle_at_78%_30%,rgba(0,180,255,0.18),transparent_58%),linear-gradient(135deg,#171717,#050505)]" />
            )}

            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
          </div>

          {/* Hero title and buttons over video */}
          <div className="relative z-10 flex min-h-[480px] flex-col justify-center p-8 sm:p-10 md:min-h-[560px] md:p-14">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.25em] text-white/75 md:text-sm"
            >
              SLATER MEDIA COMPANY · WEDDINGS
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
            >
              Your day, edited like a{" "}
              <span className="text-white/80">
                cinematic story.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            >
              Clean audio. Beautiful pacing. Real moments.
              Every detail captured with intention.
              Your story deserves more than just a wedding video.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap gap-3"
            >
              <a
                href="#custom"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                <Phone className="h-4 w-4" />
                Request Custom Package
              </a>

              <a
                href="#packages"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-black/30 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/50"
              >
                Compare Packages
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-gradient-to-r from-purple-400 via-sky-400 to-amber-300" />
        </motion.div>
      </section>

      {/* WEDDING PACKAGES */}
      <section
        id="packages"
        className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 pb-16"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Wedding Film Packages
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-2xl text-white/65"
          >
            From cinematic highlights to complete wedding-day coverage,
            find the experience that fits your story.
          </motion.p>

          <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((p) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                className={[
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1",
                  "shadow-[0_20px_70px_rgba(0,0,0,0.38)]",
                  p.highlight
                    ? "border-white/30 bg-white/[0.10]"
                    : "border-white/10 bg-white/[0.05]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_55%)] blur-2xl" />

                  <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_58%)] blur-2xl" />
                </div>

                {p.badge ? (
                  <div className="relative mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                    <Sparkles className="h-3.5 w-3.5" />
                    {p.badge}
                  </div>
                ) : (
                  <div className="h-7" />
                )}

                <div className="relative flex flex-1 flex-col">
                  <p className="text-xs font-semibold tracking-widest text-white/60">
                    {p.nickname.toUpperCase()}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    {p.name}
                  </h3>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {formatPrice(p.price)}
                  </p>

                  <p className="mt-2 min-h-[60px] text-sm leading-relaxed text-white/65">
                    {p.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.features.map((f, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
                      >
                        <span>{f.icon}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex-1">
                    <p className="text-xs font-semibold tracking-widest text-white/60">
                      INCLUDES
                    </p>

                    <ul className="mt-4 space-y-3">
                      {p.included.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm leading-relaxed text-white/75"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/65" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/contact?service=weddings&package=${encodeURIComponent(p.name)}`}
                    className={[
                      "relative mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      p.highlight
                        ? "bg-white text-neutral-950 hover:bg-white/90"
                        : "bg-white/10 text-white hover:bg-white/20",
                    ].join(" ")}
                  >
                    Inquire
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 via-sky-400 to-amber-300 opacity-65" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CUSTOM PACKAGES */}
      <section
        id="custom"
        className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 pb-24"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_100px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-12">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.15),transparent_65%)] blur-3xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/50">
                SOMETHING MORE PERSONAL?
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Build Your Custom Wedding Package
              </h3>

              <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
                Destination weddings, intimate ceremonies, additional
                coverage, multi-day celebrations, and custom edits.
                Tell us your vision and we will create a package
                tailored to your day.
              </p>

              <p className="mt-4 text-sm text-white/55">
                Custom packages and add-ons available upon request.
              </p>
            </div>

            <Link
              href="/contact?service=weddings"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 py-10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 text-sm text-white/50 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} Slater Media Company — Weddings
          </span>

          <Link
            href="/services"
            className="transition hover:text-white"
          >
            Back to Services
          </Link>
        </div>
      </footer>
    </main>
  );
}















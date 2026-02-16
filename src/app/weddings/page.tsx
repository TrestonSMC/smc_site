// app/weddings/page.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
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

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// ✅ accept refs that can be null
function useForcePlay(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        v.muted = true;
        v.playsInline = true;
        // ensure it's loaded enough to attempt play
        if (v.readyState < 2) {
          await new Promise((r) => setTimeout(r, 50));
        }
        await v.play();
      } catch {
        // autoplay can still be blocked; we fail silently
      }
    };

    tryPlay();
    const t = window.setTimeout(tryPlay, 350);
    return () => window.clearTimeout(t);
  }, [videoRef]);
}

export default function WeddingsPage() {
  const reduceMotion = useReducedMotion();

  const WEDDINGS_2_URL =
    "https://zzfbfgouvouiwhjcncga.supabase.co/storage/v1/object/public/smc-media/wedding_2.mp4";

  // ✅ refs typed correctly for TS
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const [bgOk, setBgOk] = useState(true);
  const [heroOk, setHeroOk] = useState(true);

  useForcePlay(bgVideoRef);
  useForcePlay(heroVideoRef);

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
      included: ["Wedding film", "8 hours of coverage", "1 videographer"],
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

  const Stars = () => {
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
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* ✅ Full-page video background (tiny blur via backdrop, not blur() filter) */}
      <div className="pointer-events-none fixed inset-0 -z-30">
        {bgOk ? (
          <video
            ref={bgVideoRef}
            className="h-full w-full object-cover scale-[1.03]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onError={() => setBgOk(false)}
          >
            <source src={WEDDINGS_2_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_25%,rgba(179,106,255,0.18),transparent_55%),radial-gradient(circle_at_78%_30%,rgba(0,180,255,0.16),transparent_58%),radial-gradient(circle_at_55%_80%,rgba(255,196,92,0.10),transparent_62%)]" />
        )}

        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Global nebula accents + stars (kept) */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
        <Stars />
      </div>

      {/* Top */}
      <header className="relative mx-auto max-w-6xl px-6 pt-10">
        <div className="flex items-center justify-between">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <span className="text-sm">←</span>
            <span className="text-sm font-semibold tracking-wide">Back to Services</span>
          </Link>

          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            View Packages <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* HERO (video card stays) */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_110px_rgba(0,0,0,0.55)]"
        >
          <div className="absolute inset-0">
            {heroOk ? (
              <video
                ref={heroVideoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                onError={() => setHeroOk(false)}
              >
                <source src={WEDDINGS_2_URL} type="video/mp4" />
              </video>
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_30%_25%,rgba(179,106,255,0.18),transparent_55%),radial-gradient(circle_at_78%_30%,rgba(0,180,255,0.16),transparent_58%),radial-gradient(circle_at_55%_80%,rgba(255,196,92,0.10),transparent_62%)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(179,106,255,0.18),transparent_55%),radial-gradient(circle_at_78%_30%,rgba(0,180,255,0.16),transparent_58%),radial-gradient(circle_at_55%_80%,rgba(255,196,92,0.10),transparent_62%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.10),transparent_55%)]" />
          </div>

          <div className="relative p-10 md:p-12">
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-widest text-white/60">
              WEDDING FILMS
            </motion.p>

            <motion.h1 variants={fadeUp} className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              Your day, edited like a <span className="text-white/80">cinematic story</span>.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-base md:text-lg text-white/70">
              Clean audio. Beautiful pacing. Real moments. Pick a package below or call for a custom build.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <a
                href="#custom"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
              >
                <Phone className="h-4 w-4" /> Call for Custom Package
              </a>

              <a
                href="#packages"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                Compare Packages <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            <div className="pointer-events-none mt-10 h-[2px] w-full opacity-80 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_26px_rgba(0,180,255,0.22)]" />
          </div>
        </motion.div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="relative mx-auto max-w-6xl px-6 pb-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-semibold tracking-tight">
            Packages
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-white/65 max-w-2xl">
            Ordered by price. Pick what fits the day—and the vibe.
          </motion.p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {packages.map((p) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                className={[
                  "group relative overflow-hidden rounded-3xl border p-6 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_70px_rgba(0,0,0,0.38)]",
                  p.highlight ? "border-white/25 bg-white/[0.08]" : "border-white/10 bg-white/[0.04]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_55%)] blur-2xl" />
                  <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_58%)] blur-2xl" />
                  <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_60%)] blur-2xl" />
                </div>

                {p.badge ? (
                  <div className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    <Sparkles className="h-3.5 w-3.5" />
                    {p.badge}
                  </div>
                ) : (
                  <div className="h-7" />
                )}

                <div className="relative">
                  <p className="text-xs font-semibold tracking-widest text-white/60">
                    {p.nickname.toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{p.name}</h3>

                  <p className="mt-4 text-3xl font-semibold tracking-tight">{formatPrice(p.price)}</p>
                  <p className="mt-1 text-sm text-white/60">{p.summary}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.features.map((f, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
                      >
                        <span className="text-white/80">{f.icon}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold tracking-widest text-white/60">INCLUDES</p>
                    <ul className="mt-3 space-y-2">
                      {p.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/60" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <a
                      href="#custom"
                      className={[
                        "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        p.highlight ? "bg-white text-neutral-950 hover:opacity-90" : "bg-white/10 hover:bg-white/15",
                      ].join(" ")}
                    >
                      Inquire <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CUSTOM */}
      <section id="custom" className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_100px_rgba(0,0,0,0.55)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Call for a Custom Package</h3>
              <p className="mt-2 text-white/70 max-w-2xl">
                Destination, smaller coverage, add-ons, multi-day—whatever you need, we’ll build it.
              </p>
              <p className="mt-3 text-sm text-white/60">
                Custom packages available.{" "}
                <span className="text-white/80 font-semibold">Call for details.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+10000000000"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                Contact Form <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/50">
            * Replace the phone number in the code with your real business line.
          </p>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-white/50">
          © {new Date().getFullYear()} Slater Media Company — Weddings
        </div>
      </footer>
    </main>
  );
}














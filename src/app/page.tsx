"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { media } from "@/lib/media";

export default function HomePage() {
  const leftNav = [
    { label: "Services", href: "/services" },
    { label: "Showroom", href: "/#showroom" },
  ];

  const rightNav = [
    { label: "About", href: "/#about" },
    { label: "Insider Access", href: "/insider-access" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  // ✅ Smart nav link (supports /routes and /#hash)
  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="group relative px-4 py-3 text-base font-semibold tracking-wide text-white/90 hover:text-white transition"
      onClick={() => setMobileOpen(false)}
    >
      {label}
      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-0 -translate-x-1/2 bg-white/90 transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const cards = {
    featured: {
      type: "Featured",
      eyebrow: "NEW AT SMC",
      title: "Featured Client Video",
      desc:
        "A featured cut that shows the standard — story, pacing, and premium edits you can preview right here.",
      meta: "Plays with sound • Smart fit for any aspect ratio",
      actionLabel: "Play",
      videoSrc: media.featuredClient,
      thumb: "/images/thumb-featured-video.jpg",
    },
    grid: [
      {
        type: "Web Development",
        eyebrow: "AT SMC • DOZERS",
        title: "DozersGrill.com",
        desc:
          "We develop websites — Dozers is a live build focused on speed, clean UX, and a restaurant-first brand position.",
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
        desc:
          "We develop apps — a client portal for updates, approvals, and a clean way to keep projects moving.",
        meta: "Available now",
        actionLabel: "Open App Store",
        href: "https://apps.apple.com/us/app/slater-media-co/id6754180869",
        videoThumbSrc: media.smcAppPreview,
        kind: "videoThumbLink" as const,
      },
    ],
  };

  const Dot = () => (
    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(0,180,255,0.92)] shadow-[0_0_12px_rgba(0,180,255,0.6)]" />
  );

  // Subtle SMC blue ring + depth (not over-glow)
  const smcRing =
    "border border-[rgba(0,180,255,0.22)] shadow-[0_18px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,180,255,0.12),0_0_26px_rgba(0,180,255,0.16)]";

  const cardShell =
    "group relative overflow-hidden rounded-3xl bg-white/[0.05] backdrop-blur-md " +
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,180,255,0.22),0_0_36px_rgba(0,180,255,0.22)] " +
    smcRing;

  const Glow = () => (
    <div
      className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
      style={{
        background:
          "radial-gradient(900px circle at 18% 0%, rgba(0,180,255,0.14), transparent 52%)",
      }}
    />
  );

  const CardHeaderChips = ({
    eyebrow,
    type,
  }: {
    eyebrow: string;
    type: string;
  }) => (
    <>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/75">
          <Dot />
          {eyebrow}
        </span>
      </div>
      <div className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/75">
        {type}
      </div>
    </>
  );

  // ===================== FEATURED =====================
  const FeaturedCard = ({ item }: { item: typeof cards.featured }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const bgRef = useRef<HTMLVideoElement | null>(null);
    const fgRef = useRef<HTMLVideoElement | null>(null);

    const close = () => {
      [bgRef.current, fgRef.current].forEach((v) => {
        if (!v) return;
        try {
          v.pause();
          v.currentTime = 0;
        } catch {}
      });
      setIsPlaying(false);
      setErr(null);
    };

    const play = async () => {
      setErr(null);
      setIsPlaying(true);

      requestAnimationFrame(async () => {
        try {
          if (bgRef.current) {
            bgRef.current.muted = true;
            bgRef.current.volume = 0;
            await bgRef.current.play();
          }
          if (fgRef.current) {
            fgRef.current.muted = false;
            fgRef.current.volume = 1;
            await fgRef.current.play();
          }
        } catch (e) {
          console.error("Video play error:", e);
          setErr(
            "Couldn’t start video. Check MP4 codec (H.264/AAC) and confirm the Supabase URL is public."
          );
        }
      });
    };

    return (
      <motion.div variants={fadeUp} className={`${cardShell} mx-auto w-full max-w-4xl`}>
        <Glow />

        {/* MEDIA SLOT */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
              <CardHeaderChips eyebrow={item.eyebrow} type={item.type} />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-white/70">{item.meta}</div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={play}
                  className="rounded-full border border-white/20 bg-black/45 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-black/65 transition"
                >
                  ▶ Play
                </button>
              </div>
            </>
          ) : (
            <>
              <video
                ref={bgRef}
                src={item.videoSrc}
                playsInline
                loop
                muted
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover scale-[1.18] blur-2xl opacity-60"
                onError={() => setErr("Background video failed to load (URL or permissions).")}
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                <video
                  ref={fgRef}
                  src={item.videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-full max-w-full rounded-2xl border border-[rgba(0,180,255,0.18)] bg-black/25 object-contain shadow-[0_18px_70px_rgba(0,0,0,0.65)]"
                  onError={() =>
                    setErr("Video failed to load. Confirm bucket is PUBLIC and filename matches.")
                  }
                />
              </div>

              <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white/80">
                    <Dot />
                    NOW PLAYING
                  </span>

                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full border border-white/15 bg-black/55 px-4 py-2 text-xs font-semibold text-white/85 hover:bg-black/70 transition"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative p-6 sm:p-8">
          <p className="text-sm md:text-[15px] leading-relaxed text-white/70">{item.desc}</p>

          {err && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-white/70">
              <div className="font-semibold text-white/85">Playback issue</div>
              <div className="mt-1">{err}</div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">
              {isPlaying ? "Playing" : item.actionLabel}
            </div>

            <button
              type="button"
              onClick={isPlaying ? close : play}
              className="rounded-full border border-white/15 bg-black/40 px-5 py-2 text-sm font-semibold text-white/85 hover:bg-black/60 transition"
            >
              {isPlaying ? "Close" : "Play"} →
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const GridCard = ({
    item,
    i,
  }: {
    item: (typeof cards.grid)[number];
    i: number;
  }) => {
    const isVideoThumbLink = item.kind === "videoThumbLink";

    return (
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.05 + i * 0.05 }}
        className={cardShell}
      >
        <Glow />

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {isVideoThumbLink ? (
            <video
              src={item.videoThumbSrc}
              className="absolute inset-0 h-full w-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={item.thumb}
              alt={`${item.title} thumbnail`}
              fill
              className="object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <CardHeaderChips eyebrow={item.eyebrow} type={item.type} />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-lg font-semibold tracking-tight text-white">
              {item.title}
            </div>
            <div className="mt-1 text-sm text-white/70">{item.meta}</div>
          </div>
        </div>

        <div className="relative p-6 sm:p-7">
          <p className="text-sm md:text-[15px] leading-relaxed text-white/70">{item.desc}</p>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">{item.actionLabel}</div>

            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-full border border-white/15 bg-black/40 px-5 py-2 text-sm font-semibold text-white/85 hover:bg-black/60 transition"
            >
              Open →
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===================== PORTL content loader (safe fallback) =====================
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

  return (
    <main className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* ===================== BACKGROUND VIDEO ===================== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.video
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 22, ease: "linear" }}
          className="h-full w-full object-cover brightness-[0.7] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={media.heroVideo} type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        {/* ===================== NAV (MOBILE + DESKTOP) ===================== */}
        <header className="sticky top-0 z-50 w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(0,180,255,0.85)] shadow-[0_0_20px_rgba(0,180,255,0.65)]" />
          <div className="bg-black/55 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="relative flex h-[84px] items-center">
                {/* MOBILE: hamburger */}
                <div className="flex flex-1 items-center md:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/35 p-3 text-white/85 hover:bg-black/55 transition"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </div>

                {/* Center logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Link href="/" aria-label="Go home" onClick={() => setMobileOpen(false)}>
                    <Image
                      src="/images/smc-logo.png"
                      alt="Slater Media Company Logo"
                      width={84}
                      height={84}
                      className="object-contain"
                      priority
                    />
                  </Link>
                </div>

                {/* MOBILE: quick button */}
                <div className="flex flex-1 items-center justify-end md:hidden">
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-black/55 transition"
                  >
                    Services
                  </Link>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {leftNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>

                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {rightNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileOpen && (
            <div className="md:hidden">
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-40 bg-black/60"
                onClick={() => setMobileOpen(false)}
              />
              <div className="fixed top-0 left-0 right-0 z-50 mx-auto">
                <div className="mx-3 mt-3 rounded-3xl border border-white/10 bg-black/75 backdrop-blur-xl shadow-[0_18px_70px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                    <div className="text-sm font-semibold text-white/85">Menu</div>
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/35 p-2 text-white/85 hover:bg-black/55 transition"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-2">
                    {[...leftNav, ...rightNav].map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between rounded-2xl px-4 py-4 text-base font-semibold text-white/90 hover:bg-white/5 transition"
                      >
                        <span>{l.label}</span>
                        <span className="text-white/35">→</span>
                      </Link>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="text-xs text-white/45 leading-relaxed">
                      Slater Media Company — The Creatives Express
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* ===================== HERO (CENTERED) ===================== */}
        <section className="relative min-h-[calc(100vh-84px)] flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.h1
                variants={fadeUp}
                transition={{ delay: 0.05 }}
                className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                {portlText("hero.headline", "The Creatives Express")}
              </motion.h1>

              <motion.h2
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl font-medium tracking-wide text-white/85"
              >
                {portlText("hero.subheadline", "Slater Media Company")}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.15 }}
                className="mt-5 sm:mt-6 text-base md:text-lg text-white/70 leading-relaxed"
              >
                {portlText(
                  "hero.body",
                  "We design, develop, and produce high-impact digital experiences. From scalable apps and websites to weddings, real estate, and cinematic media, we help ideas take shape and show up at their best."
                )}
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="mt-7 sm:mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </section>

        {/* ===================== NEW AT SMC ===================== */}
        <section id="services" className="relative -mt-8 sm:-mt-10 pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                variants={fadeUp}
                className="flex items-end justify-between gap-6 flex-wrap"
              >
                <div>
                  <div className="text-xs font-semibold tracking-[0.22em] text-white/55">
                    NEW AT SMC
                  </div>

                  <h3 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">
                    Driven to design, create and develop
                  </h3>

                  <p className="mt-3 max-w-3xl text-white/70 leading-relaxed">
                    Check out recent projects — with Slater Media Company anything is possible.
                  </p>
                </div>
              </motion.div>

              <div className="mt-8 flex justify-center">
                <FeaturedCard item={cards.featured} />
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.grid.map((item, i) => (
                  <GridCard key={item.title} item={item} i={i} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="pb-10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Slater Media Company — The Creatives Express
        </footer>
      </div>
    </main>
  );
}





























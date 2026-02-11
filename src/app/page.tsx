"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function HomePage() {
  const leftNav = [
    { label: "Services", href: "#services" },
    { label: "Showroom", href: "#showroom" },
  ];

  const rightNav = [
    { label: "About", href: "#about" },
    { label: "Insider Access", href: "#contact" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      className="group relative px-4 py-3 text-base font-semibold tracking-wide text-white/90 hover:text-white transition"
    >
      {label}
      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-0 -translate-x-1/2 bg-white/90 transition-all duration-300 group-hover:w-full" />
    </a>
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
      videoSrc: "/videos/featured-client.mp4",
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
        videoThumbSrc: "/videos/smc-app-preview.mp4",
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

  // ===================== FEATURED (BLUR BACKGROUND SAME VIDEO) =====================
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
          setErr("Couldn’t start video. Check MP4 codec (H.264/AAC) or file path.");
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

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
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
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover scale-[1.18] blur-2xl opacity-60"
                onError={() => setErr("Background video failed to load.")}
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center p-6">
                <video
                  ref={fgRef}
                  src={item.videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-full max-w-full rounded-2xl border border-[rgba(0,180,255,0.18)] bg-black/25 object-contain shadow-[0_18px_70px_rgba(0,0,0,0.65)]"
                  onError={() =>
                    setErr(
                      "Video failed to load. Confirm /public/videos/featured-client.mp4 and export H.264/AAC."
                    )
                  }
                />
              </div>

              <div className="absolute inset-x-0 top-0 p-4">
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

        <div className="relative p-8">
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

        <div className="relative p-7">
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
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        {/* ===================== NAV ===================== */}
        <header className="relative w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(0,180,255,0.85)] shadow-[0_0_20px_rgba(0,180,255,0.65)]" />
          <div className="bg-black/50 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6">
              <div className="relative flex h-[120px] items-center">
                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {leftNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                  <Image
                    src="/images/smc-logo.png"
                    alt="Slater Media Company Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {rightNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================== HERO (CENTERED) ===================== */}
        {/* Reduced bottom gap so NEW AT SMC sits closer */}
        <section className="relative min-h-[calc(100vh-120px)] flex items-center">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.h1
                variants={fadeUp}
                transition={{ delay: 0.05 }}
                className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                The Creatives Express
              </motion.h1>

              <motion.h2
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="mt-4 text-xl md:text-2xl font-medium tracking-wide text-white/85"
              >
                Slater Media Company
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.15 }}
                className="mt-6 text-base md:text-lg text-white/70 leading-relaxed"
              >
                We design, develop, and produce high-impact digital experiences. From scalable
                apps and websites to weddings, real estate, and cinematic media, we help ideas
                take shape and show up at their best.
              </motion.p>

              {/* tighter divider spacing */}
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </section>

        {/* ===================== NEW AT SMC ===================== */}
        {/* Pull section up by using negative margin-top and smaller padding */}
        <section id="services" className="relative -mt-10 pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between gap-6 flex-wrap">
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

























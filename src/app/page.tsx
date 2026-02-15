"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Mail, Clock, ArrowRight, Sparkles } from "lucide-react";
import { media } from "@/lib/media";

export default function HomePage() {
const leftNav = [
  { label: "Services", href: "/services" },
  { label: "Showroom", href: "/showroom" },
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

  // ===================== LUX CARD SYSTEM =====================
  const ring =
    "border border-white/10 shadow-[0_22px_90px_rgba(0,0,0,0.68),0_0_0_1px_rgba(255,255,255,0.06)]";

  const cardShell =
    "group relative overflow-hidden rounded-3xl bg-white/[0.055] backdrop-blur-md " +
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(0,0,0,0.78),0_0_0_1px_rgba(255,255,255,0.10)] " +
    ring;

  const Glow = ({ variant }: { variant: "a" | "b" | "c" }) => {
    const glowBg =
      variant === "a"
        ? "radial-gradient(900px circle at 18% 0%, rgba(0,180,255,0.28), transparent 55%), radial-gradient(700px circle at 80% 100%, rgba(0,180,255,0.14), transparent 60%)"
        : variant === "b"
        ? "radial-gradient(900px circle at 18% 0%, rgba(179,106,255,0.28), transparent 55%), radial-gradient(700px circle at 80% 100%, rgba(179,106,255,0.14), transparent 60%)"
        : "radial-gradient(900px circle at 18% 0%, rgba(255,196,92,0.24), transparent 55%), radial-gradient(700px circle at 80% 100%, rgba(255,196,92,0.12), transparent 60%)";

    const edgeAura =
      variant === "a"
        ? "radial-gradient(1200px circle at 50% 50%, transparent 62%, rgba(0,180,255,0.60) 78%, rgba(0,180,255,0.0) 92%)"
        : variant === "b"
        ? "radial-gradient(1200px circle at 50% 50%, transparent 62%, rgba(179,106,255,0.60) 78%, rgba(179,106,255,0.0) 92%)"
        : "radial-gradient(1200px circle at 50% 50%, transparent 62%, rgba(255,196,92,0.58) 78%, rgba(255,196,92,0.0) 92%)";

    return (
      <>
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
          style={{ background: glowBg }}
        />
        <div
          className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl group-hover:opacity-100 transition duration-300"
          style={{ background: edgeAura }}
        />
      </>
    );
  };

  // ===================== CLIENT LOGO MARQUEE (BIGGER + FLOAT + 2 LAYERS) =====================
  const clientLogos = useMemo(
    () => [
      { src: "/images/clients/dutch-bros.png", alt: "Dutch Bros" },
      { src: "/images/clients/fuzion.png", alt: "Fuzion" },
      { src: "/images/clients/qqs.png", alt: "QQS" },
      { src: "/images/clients/dozers.png", alt: "Dozers" },
      { src: "/images/clients/american-wolf.png", alt: "American Wolf" },
    ],
    []
  );

  const Marquee = () => {
    const front = [...clientLogos, ...clientLogos];
    const back = [...clientLogos, ...clientLogos].reverse();

    return (
      <section aria-label="Clients" className="relative -mt-10 sm:-mt-14 pb-10 sm:pb-12">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-black/70 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-black/70 to-transparent z-20" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-4 sm:mb-5 text-xs font-semibold tracking-[0.22em] text-white/55">
              TRUSTED BY • COLLABORATIONS
            </div>
          </div>

          <div className="marqueeWrap">
            {/* BACK LAYER (slower, opposite direction) */}
            <div className="marquee marquee--back" aria-hidden="true">
              <div className="marquee__track marquee__track--back">
                {back.map((l, idx) => (
                  <div
                    key={`back-${l.src}-${idx}`}
                    className="marquee__item"
                    style={{
                      ["--d" as any]: `${(idx % 7) * 110}ms`,
                      ["--s" as any]: `${0.92 + (idx % 5) * 0.03}`,
                      ["--b" as any]: `${(idx % 4) * 0.6}px`,
                      ["--o" as any]: `${0.52 + (idx % 5) * 0.06}`,
                    }}
                    title={l.alt}
                  >
                    <div className="logoBox logoBox--back">
                      <Image src={l.src} alt={l.alt} fill className="object-contain" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FRONT LAYER (bigger) */}
            <div className="marquee marquee--front">
              <div className="marquee__track marquee__track--front">
                {front.map((l, idx) => (
                  <div
                    key={`front-${l.src}-${idx}`}
                    className="marquee__item"
                    style={{
                      ["--d" as any]: `${(idx % 7) * 110}ms`,
                      ["--s" as any]: `${0.98 + (idx % 5) * 0.03}`,
                      ["--b" as any]: `${(idx % 4) * 0.45}px`,
                      ["--o" as any]: `${0.72 + (idx % 5) * 0.05}`,
                    }}
                    title={l.alt}
                  >
                    <div className="logoBox logoBox--front">
                      <Image src={l.src} alt={l.alt} fill className="object-contain" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            .marqueeWrap {
              position: relative;
              width: 100%;
              overflow: hidden;
              padding: 6px 0;
            }

            .marquee {
              overflow: hidden;
              width: 100%;
            }

            .marquee--back {
              position: absolute;
              inset: 0;
              z-index: 0;
              opacity: 0.85;
              pointer-events: none;
            }

            .marquee--front {
              position: relative;
              z-index: 1;
            }

            .marquee__track {
              display: flex;
              align-items: center;
              gap: 56px;
              width: max-content;
              padding: 0 34px;
              will-change: transform;
            }

            .marquee__track--front {
              animation: scrollLeft 18s linear infinite;
            }

            .marquee__track--back {
              animation: scrollRight 32s linear infinite;
              filter: saturate(0.95);
            }

            .marquee__item {
              display: flex;
              align-items: center;
              justify-content: center;
              transform: translateY(0) scale(var(--s));
              opacity: var(--o);
              filter: blur(var(--b)) drop-shadow(0 28px 70px rgba(0, 0, 0, 0.55));
              animation: float 4.2s ease-in-out infinite;
              animation-delay: var(--d);
              will-change: transform;
            }

            /* BIGGER LOGOS */
            .logoBox {
              position: relative;
            }

            .logoBox--front {
              height: 74px;
              width: 360px;
            }

            .logoBox--back {
              height: 64px;
              width: 320px;
            }

            @media (min-width: 640px) {
              .logoBox--front {
                height: 86px;
                width: 440px;
              }
              .logoBox--back {
                height: 72px;
                width: 380px;
              }
            }

            @media (min-width: 768px) {
              .logoBox--front {
                height: 96px;
                width: 520px;
              }
              .logoBox--back {
                height: 80px;
                width: 440px;
              }
            }

            @keyframes scrollLeft {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }

            @keyframes scrollRight {
              from {
                transform: translateX(-50%);
              }
              to {
                transform: translateX(0);
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0) scale(var(--s));
              }
              50% {
                transform: translateY(-12px) scale(var(--s));
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .marquee__track--front,
              .marquee__track--back {
                animation: none;
                transform: translateX(0);
              }
              .marquee__item {
                animation: none;
              }
            }
          `}</style>
        </div>
      </section>
    );
  };

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
        <Glow variant="a" />

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
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-0 opacity-75 mix-blend-screen bg-[radial-gradient(1200px_circle_at_50%_10%,rgba(255,196,92,0.12),transparent_55%),radial-gradient(900px_circle_at_15%_0%,rgba(0,180,255,0.14),transparent_60%),radial-gradient(900px_circle_at_85%_5%,rgba(179,106,255,0.14),transparent_60%)]" />

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
                  className="rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-black/65 transition shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.6)]"
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
                  className="max-h-full max-w-full rounded-2xl border border-white/10 bg-black/25 object-contain shadow-[0_22px_90px_rgba(0,0,0,0.72)]"
                  onError={() =>
                    setErr("Video failed to load. Confirm bucket is PUBLIC and filename matches.")
                  }
                />
              </div>

              <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white/80">
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
    const variant: "a" | "b" | "c" = i % 3 === 0 ? "b" : i % 3 === 1 ? "c" : "a";

    return (
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.05 + i * 0.05 }}
        className={cardShell}
      >
        <Glow variant={variant} />

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

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className="absolute inset-0 opacity-75 mix-blend-screen bg-[radial-gradient(900px_circle_at_20%_0%,rgba(179,106,255,0.14),transparent_58%),radial-gradient(900px_circle_at_80%_10%,rgba(255,196,92,0.12),transparent_60%)]" />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-lg font-semibold tracking-tight text-white">{item.title}</div>
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
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(1200px_circle_at_50%_0%,rgba(255,196,92,0.10),transparent_60%),radial-gradient(1100px_circle_at_10%_0%,rgba(0,180,255,0.10),transparent_55%),radial-gradient(1100px_circle_at_90%_0%,rgba(179,106,255,0.09),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* ===================== NAV ===================== */}
        <header className="sticky top-0 z-50 w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_24px_rgba(0,180,255,0.35)]" />
          <div className="bg-black/55 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="relative flex h-[84px] items-center">
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

                <div className="absolute left-1/2 -translate-x-1/2">
                  <Link href="/" aria-label="Go home" onClick={() => setMobileOpen(false)}>
                    <Image
                      src="/images/smc-logo.png"
                      alt="Slater Media Company Logo"
                      width={84}
                      height={84}
                      className="object-contain drop-shadow-[0_0_18px_rgba(255,196,92,0.10)]"
                      priority
                    />
                  </Link>
                </div>

                <div className="flex flex-1 items-center justify-end md:hidden">
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-black/55 transition"
                  >
                    Services
                  </Link>
                </div>

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

        {/* ===================== HERO ===================== */}
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

        <Marquee />

        {/* ===================== NEW AT SMC ===================== */}
        <section id="services" className="relative -mt-2 sm:-mt-4 pb-14 sm:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

        {/* ===================== INSIDER ACCESS (CONIC BORDER + SHEEN) ===================== */}
        <section id="insider-access" className="relative pb-10 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp} className="relative">
                {/* conic gradient border + animated sweep */}
                <div className="luxBorder">
                  <div className="luxSheen" />
                </div>

                <div className={`${cardShell} relative`}>
                  <Glow variant="c" />

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-80 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(255,196,92,0.18),transparent_60%),radial-gradient(900px_circle_at_10%_0%,rgba(0,180,255,0.12),transparent_55%),radial-gradient(900px_circle_at_90%_0%,rgba(179,106,255,0.12),transparent_55%)]" />

                  <div className="relative p-7 sm:p-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2">
                          <Sparkles className="h-4 w-4 text-white/80" />
                          <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                            INSIDER ACCESS
                          </div>
                        </div>

                        <h3 className="mt-4 text-2xl md:text-4xl font-semibold tracking-tight">
                          Early access to what we’re building
                        </h3>
                        <p className="mt-3 max-w-3xl text-white/70 leading-relaxed">
                          Not everything we build hits the market right away. Get early previews,
                          tools, resources, and drop announcements — before they’re public.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {[
                            { t: "High-signal drops", d: "Only what matters" },
                            { t: "No spam", d: "Ever" },
                            { t: "Early previews", d: "Before launch" },
                          ].map((x) => (
                            <div
                              key={x.t}
                              className="rounded-full border border-white/10 bg-black/35 px-4 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
                            >
                              <div className="text-xs font-semibold text-white/85">{x.t}</div>
                              <div className="text-[11px] text-white/55">{x.d}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Link
                          href="/insider-access"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-black/65 transition"
                        >
                          Get Insider Access <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                          href="mailto:hello@slatermediacompany.com"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-6 py-3 text-sm font-semibold text-white/75 hover:bg-black/45 transition"
                        >
                          <Mail className="h-4 w-4" />
                          Email us
                        </a>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          icon: Sparkles,
                          t: "Early releases",
                          d: "Preview features, templates, and product drops before launch.",
                        },
                        {
                          icon: Mail,
                          t: "Tools + resources",
                          d: "Guides, frameworks, and assets we actually use to ship.",
                        },
                        {
                          icon: ArrowRight,
                          t: "Newsletter drops",
                          d: "Short, useful updates — experiments, wins, and what’s next.",
                        },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="rounded-3xl border border-white/10 bg-black/30 p-5 sm:p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35">
                              <x.icon className="h-5 w-5 text-white/85" />
                            </div>
                            <div className="text-sm font-semibold text-white/90">{x.t}</div>
                          </div>
                          <div className="mt-3 text-sm text-white/65 leading-relaxed">{x.d}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 text-xs text-white/45 leading-relaxed">
                      No spam. Just high-signal updates and early access.
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .luxBorder {
                    position: absolute;
                    inset: -1px;
                    border-radius: 24px;
                    background: conic-gradient(
                      from 180deg,
                      rgba(179, 106, 255, 0.65),
                      rgba(0, 180, 255, 0.65),
                      rgba(255, 196, 92, 0.55),
                      rgba(179, 106, 255, 0.65)
                    );
                    filter: blur(0px);
                    opacity: 0.55;
                    pointer-events: none;
                  }

                  .luxBorder::before {
                    content: "";
                    position: absolute;
                    inset: 1px;
                    border-radius: 23px;
                    background: rgba(0, 0, 0, 0.35);
                    mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
                    -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    padding: 1px;
                  }

                  .luxSheen {
                    position: absolute;
                    inset: -140px -240px;
                    background: radial-gradient(
                      520px circle at 0% 50%,
                      rgba(255, 255, 255, 0.16),
                      rgba(255, 255, 255, 0) 62%
                    );
                    transform: translateX(-35%);
                    animation: sheen 5.8s ease-in-out infinite;
                    opacity: 0.65;
                    mix-blend-mode: screen;
                  }

                  @keyframes sheen {
                    0% {
                      transform: translateX(-35%) rotate(-8deg);
                    }
                    50% {
                      transform: translateX(35%) rotate(8deg);
                    }
                    100% {
                      transform: translateX(-35%) rotate(-8deg);
                    }
                  }

                  @media (prefers-reduced-motion: reduce) {
                    .luxSheen {
                      animation: none;
                      transform: translateX(0);
                    }
                  }
                `}</style>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===================== HOURS + CONTACT (COMBINED) ===================== */}
        <section id="contact" className="relative pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp} className={cardShell}>
                <Glow variant="b" />

                <div className="relative p-7 sm:p-10">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.22em] text-white/55">
                        CONTACT
                      </div>
                      <h3 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">
                        Let’s build something clean.
                      </h3>
                      <p className="mt-3 max-w-3xl text-white/70 leading-relaxed">
                        Websites, apps, content, brand — send the details and we’ll reply with next
                        steps, timeline, and a clean plan.
                      </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <a
                        href="mailto:hello@slatermediacompany.com"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-6 py-3 text-sm font-semibold text-white/75 hover:bg-black/45 transition"
                      >
                        <Mail className="h-4 w-4" />
                        hello@slatermediacompany.com
                      </a>
                      <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-black/65 transition"
                      >
                        Services <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-7">
                      <div className="text-xs font-semibold tracking-[0.22em] text-white/55">
                        HOURS OF OPERATION
                      </div>
                      <h4 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight">
                        Monday – Friday
                      </h4>
                      <div className="mt-3 flex items-center gap-2 text-white/75">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-semibold">8:00 AM – 5:00 PM</span>
                      </div>

                      <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-5">
                        <div className="text-sm font-semibold text-white/85">Quick note</div>
                        <div className="mt-2 text-sm text-white/65 leading-relaxed">
                          For urgent requests, include “URGENT” in the subject or message and we’ll
                          prioritize routing.
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-7">
                      <div className="text-xs font-semibold tracking-[0.22em] text-white/55">
                        LET’S GET STARTED
                      </div>
                      <h4 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight">
                        Tell us what you’re building
                      </h4>

                      <form onSubmit={submit} className="mt-6 grid gap-3">
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
                            className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/25 focus:bg-black/40 transition"
                          />
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="Email"
                            className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/25 focus:bg-black/40 transition"
                          />
                        </div>

                        <input
                          value={form.company}
                          onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                          placeholder="Company (optional)"
                          className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/25 focus:bg-black/40 transition"
                        />

                        <textarea
                          required
                          value={form.message}
                          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                          placeholder="What are we building? (Website, app, content, brand, etc.)"
                          rows={5}
                          className="w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/25 focus:bg-black/40 transition"
                        />

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-black/65 transition disabled:opacity-60 disabled:hover:bg-black/45"
                          >
                            {sending ? "Sending…" : "Send request"}
                            <ArrowRight className="h-4 w-4" />
                          </button>

                          {sent === "ok" && (
                            <div className="text-sm text-white/70">
                              Received — we’ll hit you back soon.
                            </div>
                          )}
                          {sent === "err" && (
                            <div className="text-sm text-white/70">
                              Didn’t send. You can email{" "}
                              <a
                                className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
                                href="mailto:hello@slatermediacompany.com"
                              >
                                hello@slatermediacompany.com
                              </a>
                              .
                            </div>
                          )}
                        </div>
                      </form>

                      <div className="mt-6 text-xs text-white/45 leading-relaxed">
                        By submitting, you agree to be contacted about your project. No spam — ever.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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

































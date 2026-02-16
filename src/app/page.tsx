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

  // ✅ simple mobile flag (used to reduce motion + avoid autoplay video thumbnails)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ reduce motion on mobile to prevent "loads open then lags in"
  const fadeUp = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

  const stagger = isMobile
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

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
      meta: "Tap to play • Sound on",
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
          "A live build focused on speed, clean UX, and a restaurant-first brand position.",
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
          "A client portal for updates, approvals, and a clean way to keep projects moving.",
        meta: "Available now",
        actionLabel: "Open App Store",
        href: "https://apps.apple.com/us/app/slater-media-co/id6754180869",
        // ✅ desktop-only video thumb; mobile uses a static image to avoid lag/autoplay issues
        videoThumbSrc: media.smcAppPreview,
        mobileThumb: "/images/thumb-smc-app.jpg",
        kind: "videoThumbLink" as const,
      },
    ],
  };

  // ===================== LUX CARD SYSTEM (lightened) =====================
  const ring =
    "border border-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.06)]";

  const cardShell =
    "group relative overflow-hidden rounded-3xl bg-white/[0.045] backdrop-blur-md " +
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_110px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.10)] " +
    ring;

  const Glow = ({ variant }: { variant: "a" | "b" | "c" }) => {
    // ✅ reduced intensity (less “busy”)
    const glowBg =
      variant === "a"
        ? "radial-gradient(900px circle at 18% 0%, rgba(0,180,255,0.20), transparent 60%)"
        : variant === "b"
        ? "radial-gradient(900px circle at 18% 0%, rgba(179,106,255,0.18), transparent 60%)"
        : "radial-gradient(900px circle at 18% 0%, rgba(255,196,92,0.16), transparent 62%)";

    return (
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ background: glowBg }}
      />
    );
  };

  // ===================== CLIENT LOGO MARQUEE (SIMPLIFIED: 1 LAYER) =====================
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

    return (
      <section aria-label="Clients" className="relative -mt-10 sm:-mt-14 pb-8 sm:pb-10">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-black/70 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-black/70 to-transparent z-20" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-3 sm:mb-4 text-xs font-semibold tracking-[0.22em] text-white/55">
              TRUSTED BY • COLLABORATIONS
            </div>
          </div>

          <div className="marqueeWrap">
            <div className="marquee">
              <div className="marquee__track">
                {front.map((l, idx) => (
                  <div
                    key={`front-${l.src}-${idx}`}
                    className="marquee__item"
                    title={l.alt}
                    style={{
                      ["--d" as any]: `${(idx % 7) * 110}ms`,
                    }}
                  >
                    <div className="logoBox">
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
            .marquee__track {
              display: flex;
              align-items: center;
              gap: 42px;
              width: max-content;
              padding: 0 26px;
              will-change: transform;
              animation: scrollLeft 26s linear infinite;
            }
            .marquee__item {
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.85;
              filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.55));
              /* ✅ no float on mobile */
              animation: none;
              animation-delay: var(--d);
              will-change: transform;
            }
            .logoBox {
              position: relative;
              height: 52px;
              width: 240px;
            }
            @media (min-width: 640px) {
              .logoBox {
                height: 70px;
                width: 360px;
              }
            }
            @media (min-width: 768px) {
              .logoBox {
                height: 82px;
                width: 430px;
              }
              /* ✅ float only on desktop */
              .marquee__item {
                animation: float 4.2s ease-in-out infinite;
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
            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .marquee__track {
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

  // ===================== FEATURED (SIMPLIFIED: NO blurred background video) =====================
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
        } catch (e) {
          console.error("Video play error:", e);
          setErr(
            "Couldn’t start video. Check MP4 codec (H.264/AAC) and confirm the URL is public."
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
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 opacity-70 bg-[radial-gradient(900px_circle_at_50%_10%,rgba(0,180,255,0.10),transparent_60%)]" />

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
        transition={isMobile ? undefined : { delay: 0.05 + i * 0.05 }}
        className={cardShell}
      >
        <Glow variant={variant} />

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {isVideoThumbLink ? (
            isMobile ? (
              <Image
                src={(item as any).mobileThumb || "/images/thumb-smc-app.jpg"}
                alt={`${item.title} thumbnail`}
                fill
                className="object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
              />
            ) : (
              <video
                src={(item as any).videoThumbSrc}
                className="absolute inset-0 h-full w-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            )
          ) : (
            <Image
              src={(item as any).thumb}
              alt={`${item.title} thumbnail`}
              fill
              className="object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-lg font-semibold tracking-tight text-white">{item.title}</div>
            <div className="mt-1 text-sm text-white/70">{(item as any).meta}</div>
          </div>
        </div>

        <div className="relative p-6 sm:p-7">
          <p className="text-sm md:text-[15px] leading-relaxed text-white/70">{(item as any).desc}</p>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">{(item as any).actionLabel}</div>

            <a
              href={(item as any).href}
              target={(item as any).href.startsWith("http") ? "_blank" : undefined}
              rel={(item as any).href.startsWith("http") ? "noreferrer" : undefined}
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
      {/* ✅ HERO BACKGROUND: reliable (poster) + no framer-motion */}
      <HeroBackground isMobile={isMobile} heroSrc={media.heroVideo} />

      <div className="relative z-10">
        {/* ===================== NAV ===================== */}
        <header className="sticky top-0 z-50 w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,rgba(179,106,255,0.85),rgba(0,180,255,0.85),rgba(255,196,92,0.85))] shadow-[0_0_18px_rgba(0,180,255,0.28)]" />
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

        {/* ===================== HERO (LESS CLUTTER) ===================== */}
        <section className="relative min-h-[calc(92vh-84px)] flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div
                variants={fadeUp}
                className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 text-white/80" />
                <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                  SLATER MEDIA COMPANY
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={isMobile ? undefined : { delay: 0.05 }}
                className="mt-5 text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                {portlText("hero.headline", "The Creatives Express")}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={isMobile ? undefined : { delay: 0.12 }}
                className="mt-5 sm:mt-6 text-base md:text-lg text-white/70 leading-relaxed"
              >
                {portlText(
                  "hero.body",
                  "We design, develop, and produce high-impact digital experiences — websites, apps, and cinematic media that help brands show up at their best."
                )}
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={isMobile ? undefined : { delay: 0.18 }}
                className="mt-7 sm:mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </section>

        <Marquee />

        {/* ===================== NEW AT SMC ===================== */}
        <section id="services" className="relative -mt-2 sm:-mt-4 pb-12 sm:pb-14">
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
                    Recent work and builds
                  </h3>

                  <p className="mt-3 max-w-3xl text-white/70 leading-relaxed">
                    A quick look at what we’re shipping right now.
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

        {/* ===================== INSIDER ACCESS (KEEP, BUT A BIT LIGHTER) ===================== */}
        <section id="insider-access" className="relative pb-10 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp} className={`${cardShell} relative`}>
                <Glow variant="c" />

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
                        Get early previews, tools, resources, and announcements — before they’re public.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {[
                          { t: "High-signal drops", d: "Only what matters" },
                          { t: "No spam", d: "Ever" },
                          { t: "Early previews", d: "Before launch" },
                        ].map((x) => (
                          <div
                            key={x.t}
                            className="rounded-full border border-white/10 bg-black/35 px-4 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
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
                        className="rounded-3xl border border-white/10 bg-black/30 p-5 sm:p-6 shadow-[0_18px_70px_rgba(0,0,0,0.25)]"
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

function HeroBackground({
  isMobile,
  heroSrc,
}: {
  isMobile: boolean;
  heroSrc: string;
}) {
  const vRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    const t = setTimeout(() => {
      // iOS Safari likes these set before play()
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;

      // attempt autoplay
      v.play().catch(() => {
        // Autoplay may be blocked; poster will show
      });
    }, 60);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <video
        ref={vRef}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore - iOS Safari attribute
        webkit-playsinline="true"
        preload={isMobile ? "metadata" : "auto"}
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        className="h-full w-full object-cover brightness-[0.72] contrast-[1.05] pointer-events-none"
      >
        <source src={heroSrc} type="video/mp4" />
      </video>

      {/* ✅ keep overlays minimal */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(0,180,255,0.08),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
    </div>
  );
}




































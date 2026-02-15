"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Megaphone,
  Video,
  HeartHandshake,
  Home,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ServicesPage() {
  const leftNav = [
    { label: "Home", href: "/" },
    { label: "Showroom", href: "/#showroom" },
  ];

  const rightNav = [
    { label: "About", href: "/#about" },
    { label: "Insider Access", href: "/#contact" },
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
    <Link
      href={href}
      className="group relative px-4 py-3 text-base font-semibold tracking-wide text-white/90 hover:text-white transition"
    >
      {label}
      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-0 -translate-x-1/2 bg-white/90 transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const Dot = () => (
    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(0,180,255,0.92)] shadow-[0_0_12px_rgba(0,180,255,0.6)]" />
  );

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

  const divider =
    "my-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent";

  // ✅ Re-ordered to match your flow:
  // Weddings, Film & Media, Real Estate, Marketing
  const categories = [
    {
      slug: "weddings",
      title: "Weddings",
      icon: HeartHandshake,
      eyebrow: "HIGHLIGHT • CEREMONY • STORY",
      desc:
        "Wedding films that feel like a movie — clean audio, beautiful pacing, and moments you’ll replay forever. Plus social-ready cuts for the week-of hype.",
      bullets: [
        "Highlight film + full ceremony",
        "Vows / speeches audio capture",
        "Social teasers + vertical edits",
        "Delivery + keepsakes",
      ],
      image: "/images/services/weddings.jpg",
    },
    {
      slug: "film-media",
      title: "Film & Media",
      icon: Video,
      eyebrow: "CINEMATIC • STORY • PRODUCTION",
      desc:
        "Cinematic content with real film energy — story-driven edits, brand films, and budget-friendly filmmaking that still looks premium and intentional.",
      bullets: [
        "Cinematic brand films + promos",
        "Short-form reels (IG / TikTok / YT Shorts)",
        "Event coverage + highlight edits",
        "Lighting, sound, color, delivery",
      ],
      image: "/images/services/film-media.jpg",
    },
    {
      slug: "real-estate",
      title: "Real Estate",
      icon: Home,
      eyebrow: "LISTINGS • DRONE • AGENT BRAND",
      desc:
        "Listing content that sells the vibe — fast turnarounds, crisp visuals, and agent brand consistency that makes every post look intentional.",
      bullets: [
        "Listing photo/video packages",
        "Drone footage (where allowed)",
        "Vertical reels for socials",
        "Agent brand content bundles",
      ],
      image: "/images/services/real-estate.jpg",
    },
    {
      slug: "marketing",
      title: "Marketing",
      icon: Megaphone,
      eyebrow: "CONTENT • ADS • SEO • STRATEGY",
      desc:
        "Marketing that actually moves — content + paid + SEO working together. We plan it, create it, run it, and report it so you know what’s winning.",
      bullets: [
        "Content plan + consistency system",
        "Google Ads + Search strategy",
        "Meta ads (IG / FB) + retargeting",
        "SEO + local visibility boosts",
      ],
      image: "/images/services/marketing.jpg",
    },
  ];

  return (
    <main className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* ===================== BACKGROUND VIDEO (same as Home) ===================== */}
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
                  <Link href="/" aria-label="Go home">
                    <Image
                      src="/images/smc-logo.png"
                      alt="Slater Media Company Logo"
                      width={100}
                      height={100}
                      className="object-contain"
                      priority
                    />
                  </Link>
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

        {/* ===================== HERO (CLEAN) ===================== */}
        <section className="relative pt-16 pb-8">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-4xl text-center"
            >
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                Built for{" "}
                <span className="text-white/90">cinema</span>,{" "}
                <span className="text-white/90">content</span>, and{" "}
                <span className="text-white/90">growth</span>.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-base md:text-lg text-white/70 leading-relaxed"
              >
                Slater Media Company exists to create. We bridge the gap between
                vision and reality — you imagine it, and we bring it to life.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Link
                  href="/#contact"
                  className="rounded-full border border-white/15 bg-black/40 px-7 py-3 text-sm font-semibold text-white/90 hover:bg-black/60 transition inline-flex items-center justify-center gap-2"
                >
                  <Dot />
                  Insider Access <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#showroom"
                  className="rounded-full border border-white/15 bg-transparent px-7 py-3 text-sm font-semibold text-white/85 hover:text-white hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
                >
                  See work <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className={divider} />
            </motion.div>
          </div>
        </section>

        {/* ===================== CARDS (VIDEO-FIRST ORDER) ===================== */}
        <section className="relative pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <motion.div key={c.slug} variants={fadeUp} className={cardShell}>
                    <Glow />

                    {/* media top */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={c.image}
                        alt={`${c.title} thumbnail`}
                        fill
                        className="object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-500"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-semibold text-white/80">
                        <Dot />
                        {c.eyebrow}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl border border-white/10 bg-black/45 p-3">
                            <Icon className="h-6 w-6 text-white/90" />
                          </div>
                          <div className="text-2xl font-semibold tracking-tight">
                            {c.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* content */}
                    <div className="relative p-7">
                      <p className="text-white/70 leading-relaxed">{c.desc}</p>

                      <ul className="mt-5 grid gap-2">
                        {c.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm text-white/75"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/70" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <Link
                          href={`/services/${c.slug}`}
                          className="rounded-full border border-white/15 bg-black/40 px-5 py-2 text-sm font-semibold text-white/85 hover:bg-black/60 transition inline-flex items-center justify-center gap-2"
                        >
                          Learn more <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                          href="/#contact"
                          className="text-sm font-semibold text-white/75 hover:text-white transition inline-flex items-center gap-2"
                        >
                          Start with this <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ===================== DEV CORNER (SECRET CTA) ===================== */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="mt-10"
            >
              <div
                className={
                  "relative overflow-hidden rounded-3xl bg-black/45 backdrop-blur-md " +
                  "border border-white/10 shadow-[0_22px_80px_rgba(0,0,0,0.7)]"
                }
              >
                {/* subtle glow */}
                <div
                  className="pointer-events-none absolute -inset-px opacity-90"
                  style={{
                    background:
                      "radial-gradient(800px circle at 20% 20%, rgba(0,180,255,0.16), transparent 55%), radial-gradient(700px circle at 80% 0%, rgba(255,255,255,0.08), transparent 52%)",
                  }}
                />

                <div className="relative p-7 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/75">
                        <Lock className="h-3.5 w-3.5" />
                        Hidden Feature
                      </div>

                      <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
                        Developer’s Corner
                      </h2>
                      <p className="mt-3 text-white/70 leading-relaxed">
                        For the ones who want the full build: websites, apps, landing
                        pages, and systems that scale. If you know, you know.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {[
                          "Next.js / React builds",
                          "iOS + Android apps",
                          "Maintenance + upgrades",
                          "Performance + SEO structure",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/services/development"
                        className="group rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Push Me
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/#contact"
                        className="rounded-full border border-white/15 bg-black/40 px-7 py-3 text-sm font-semibold text-white/85 hover:bg-black/60 transition inline-flex items-center justify-center gap-2"
                      >
                        Get a quote <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===================== BOTTOM CTA ===================== */}
            <div className="mt-12 text-center">
              <div className="text-white/70 text-sm">
                Not sure what you need? We’ll map it out in one quick call.
              </div>
              <Link
                href="/#contact"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/40 px-7 py-3 text-sm font-semibold text-white/90 hover:bg-black/60 transition"
              >
                Get a custom plan <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Slater Media Company — The Creatives Express
        </footer>
      </div>
    </main>
  );
}





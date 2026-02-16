// app/services/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Megaphone,
  Video,
  HeartHandshake,
  Home,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export default function ServicesPage() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
      {children}
    </span>
  );

  const SectionTitle = ({
    kicker,
    title,
    sub,
  }: {
    kicker: string;
    title: string;
    sub?: string;
  }) => (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-widest text-white/60">
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {sub ? <p className="mt-4 text-white/70">{sub}</p> : null}
    </div>
  );

  const Dot = () => (
    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(0,180,255,0.92)] shadow-[0_0_12px_rgba(0,180,255,0.6)]" />
  );

  // ✅ Re-ordered: Weddings, Film & Media, Real Estate, Marketing
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

  // Shooting stars (same as About)
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

  const ServiceCard = ({
    c,
  }: {
    c: (typeof categories)[number];
  }) => {
    const Icon = c.icon;
    return (
      <motion.div
        variants={fadeUp}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_70px_rgba(0,0,0,0.38)]"
      >
        {/* subtle neon sweep (same language as About cards) */}
        <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_55%)] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_58%)] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_60%)] blur-2xl" />
        </div>

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
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/45">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/5 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Icon className="relative h-6 w-6 text-white/90" />
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
              <li key={b} className="flex items-start gap-2 text-sm text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/60" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Link
              href={`/services/${c.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/#contact"
              className="text-sm font-semibold text-white/75 hover:text-white transition inline-flex items-center gap-2"
            >
              Start with this <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* bottom neon hairline */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
      </motion.div>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Background: stars + nebula haze + SMC neon (match About) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
        <Stars />
      </div>

      <div className="relative">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-32 md:pb-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={stagger}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
                <Pill>
                  <Sparkles className="h-4 w-4 text-white/80" />
                  Built for cinema + growth
                </Pill>
                <Pill>
                  <Workflow className="h-4 w-4 text-white/80" />
                  Strategy → create → deliver
                </Pill>
                <Pill>
                  <ShieldCheck className="h-4 w-4 text-white/80" />
                  One standard, always
                </Pill>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                Built for <span className="text-white/90">cinema</span>,{" "}
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
                  href="/insider-access"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
                >
                  <Dot />
                  Insider Access <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#showroom"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  See work <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-6 pb-16">
            <SectionTitle
              kicker="SERVICES"
              title="Choose a lane — or build the whole system"
              sub="Your content, your site, and your growth should feel like one brand. These are the core lanes we plug into."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {categories.map((c) => (
                <ServiceCard key={c.slug} c={c} />
              ))}
            </motion.div>

            {/* DEV CORNER (kept, but styled to match About) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="mt-10"
            >
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_100px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute -inset-40 opacity-70">
                  <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_60%)] blur-3xl" />
                  <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)] blur-3xl" />
                </div>

                <div className="relative grid gap-6 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/75">
                      <Lock className="h-3.5 w-3.5" />
                      Hidden Feature
                    </div>

                    <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
                      Developer’s Corner
                    </h2>
                    <p className="mt-3 text-white/70 leading-relaxed">
                      For the ones who want the full build: websites, apps,
                      landing pages, and systems that scale. If you know, you
                      know.
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

                  <div className="md:col-span-4 md:justify-self-end">
                    <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                      <Link
                        href="/services/development"
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                      >
                        <Sparkles className="h-4 w-4" />
                        Push Me
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/#contact"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
                      >
                        Get a quote <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-80 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_26px_rgba(0,180,255,0.26)]" />
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="text-white/70 text-sm">
                Not sure what you need? We’ll map it out in one quick call.
              </div>
              <Link
                href="/#contact"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
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







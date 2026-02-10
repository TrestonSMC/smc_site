"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
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

  // 👇 New: prettier card content (use these for Services / Showroom sections)
  const cards = [
    {
      title: "Web + App Development",
      desc: "Modern builds with clean UI, fast performance, and scalable structure.",
      tag: "Build",
    },
    {
      title: "Content + Commercial",
      desc: "Cinematic visuals, brand storytelling, and social-ready deliverables.",
      tag: "Create",
    },
    {
      title: "Weddings",
      desc: "High-end films that feel timeless—shot and edited with intention.",
      tag: "Capture",
    },
    {
      title: "Real Estate",
      desc: "Photo + video that sells the space—interiors, exteriors, and lifestyle.",
      tag: "Show",
    },
  ];

  const Card = ({
    title,
    desc,
    tag,
    i,
  }: {
    title: string;
    desc: string;
    tag: string;
    i: number;
  }) => (
    <motion.a
      href="#services"
      variants={fadeUp}
      transition={{ delay: 0.18 + i * 0.06 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md
                 shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]
                 transition-all duration-300 hover:-translate-y-1"
    >
      {/* glow edge */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background:
            "radial-gradient(600px circle at 30% 20%, rgba(0,180,255,0.22), transparent 55%)",
        }}
      />
      {/* top highlight line */}
      <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* tag pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[12px] font-semibold tracking-wide text-white/80">
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(0,180,255,0.9)] shadow-[0_0_12px_rgba(0,180,255,0.65)]" />
        {tag}
      </div>

      <div className="mt-4">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-white/70">
          {desc}
        </p>
      </div>

      {/* arrow */}
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/85">
        <span className="opacity-80 group-hover:opacity-100 transition">
          Explore
        </span>
        <span className="translate-x-0 group-hover:translate-x-1 transition">
          →
        </span>
      </div>

      {/* subtle corner sheen */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rotate-12 bg-white/10 blur-2xl opacity-40" />
    </motion.a>
  );

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

      {/* ===================== CONTENT ===================== */}
      <div className="relative z-10">
        {/* ===================== NAV ===================== */}
        <header className="relative w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(0,180,255,0.85)] shadow-[0_0_20px_rgba(0,180,255,0.65)]" />

          <div className="bg-black/50 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6">
              <div className="relative flex h-[120px] items-center">
                {/* LEFT */}
                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {leftNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>

                {/* LOGO */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Image
                    src="/images/smc-logo.png"
                    alt="Slater Media Company Logo"
                    width={110}
                    height={110}
                    className="object-contain drop-shadow-[0_0_18px_rgba(0,180,255,0.25)]"
                    priority
                  />
                </div>

                {/* RIGHT */}
                <div className="hidden md:flex flex-1 items-center justify-evenly">
                  {rightNav.map((l) => (
                    <NavLink key={l.href} {...l} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================== HERO ===================== */}
        <section className="relative min-h-screen">
          <div className="mx-auto max-w-7xl px-6 pt-28 pb-24">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              {/* PRIMARY STATEMENT */}
              <motion.h1
                variants={fadeUp}
                transition={{ delay: 0.05 }}
                className="mt-6 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                The Creatives Express
              </motion.h1>

              {/* TAGLINE */}
              <motion.h2
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="mt-3 text-xl md:text-2xl font-medium tracking-wide text-white/85"
              >
                Slater Media Company
              </motion.h2>

              {/* DESCRIPTION */}
              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.15 }}
                className="mt-6 text-base md:text-lg text-white/70 leading-relaxed"
              >
                We design, develop, and produce high-impact digital experiences.
                From scalable apps and websites to weddings, real estate, and
                cinematic media, we help ideas take shape and show up at their
                best.
              </motion.p>
            </motion.div>

            {/* ===================== CARDS (NEW) ===================== */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {cards.map((c, i) => (
                <Card key={c.title} {...c} i={i} />
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
















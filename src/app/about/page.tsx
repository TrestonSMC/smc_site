// app/about/page.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Video,
  Megaphone,
  Layers,
  ShieldCheck,
  Rocket,
  Target,
  Users,
  ChevronRight,
  Mail,
} from "lucide-react";

export default function AboutPage() {
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

  const Stat = ({
    label,
    value,
    hint,
  }: {
    label: string;
    value: string;
    hint?: string;
  }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
      {hint ? <div className="mt-3 text-xs text-white/50">{hint}</div> : null}
    </div>
  );

  const Card = ({
    icon: Icon,
    title,
    desc,
    bullets,
  }: {
    icon: any;
    title: string;
    desc: string;
    bullets?: string[];
  }) => (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_70px_rgba(0,0,0,0.38)]">
      {/* subtle SMC neon sweep */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_55%)] blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_58%)] blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_60%)] blur-2xl" />
      </div>

      <div className="relative flex items-start gap-4">
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/5 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Icon className="relative h-6 w-6 text-white/90" />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-white/70">{desc}</p>

          {bullets?.length ? (
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 text-white/50" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* bottom neon hairline */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
    </div>
  );

  // Shooting stars
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
      {/* Background: stars + nebula haze + SMC neon */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
        <Stars />
      </div>

      {/* HERO (add top padding because global nav is sticky) */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-32 md:pb-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-12"
          >
            <motion.div variants={fadeUp} className="md:col-span-7">
              <div className="flex flex-wrap gap-3">
                <Pill>
                  <Sparkles className="h-4 w-4 text-white/80" />
                  Cinematic + Future-forward
                </Pill>
                <Pill>
                  <Layers className="h-4 w-4 text-white/80" />
                  Media + Tech under one roof
                </Pill>
                <Pill>
                  <ShieldCheck className="h-4 w-4 text-white/80" />
                  Built for scale
                </Pill>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                We don’t just build brands.
                <span className="block text-white/80">We engineer momentum.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-white/70">
                Slater Media Company is a full-service creative and digital
                development studio. We combine cinematic storytelling, modern
                design, and real engineering to launch systems that look elite
                and perform in the real world.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#showroom"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
                >
                  View Work <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/insider-access"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Start a Project <Rocket className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat
                  value="Full Stack"
                  label="Creative + Engineering"
                  hint="Design, code, content, launch"
                />
                <Stat
                  value="Built to Scale"
                  label="Systems over templates"
                  hint="Not brochure sites — platforms"
                />
                <Stat
                  value="High Output"
                  label="Fast, intentional execution"
                  hint="Momentum is the product"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative md:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_90px_rgba(0,0,0,0.45)]">
                <motion.div
                  aria-hidden
                  className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
                  animate={
                    reduceMotion
                      ? {}
                      : { opacity: [0.45, 0.85, 0.45], scale: [1, 1.06, 1] }
                  }
                  transition={
                    reduceMotion
                      ? {}
                      : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
                  }
                />

                <div className="relative mx-auto mt-2 grid h-56 w-56 place-items-center rounded-full">
                  <div className="absolute -inset-10 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute inset-0 rounded-full border border-white/25 shadow-[0_0_80px_rgba(255,255,255,0.22)]" />
                  <div className="absolute inset-6 rounded-full border border-white/15" />
                  <div className="absolute inset-10 rounded-full border border-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-semibold tracking-tight">
                      SMC
                    </div>
                    <div className="mt-1 text-xs tracking-widest text-white/60">
                      THE CREATIVES EXPRESS
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                        <Target className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Mission</div>
                        <div className="text-sm text-white/70">
                          Turn local presence into digital dominance.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                        <Users className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Approach</div>
                        <div className="text-sm text-white/70">
                          High standards, fast iteration, clean execution.
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/services"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    Explore Services <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-12"
          >
            <motion.div variants={fadeUp} className="md:col-span-6">
              <SectionTitle
                kicker="WHO WE ARE"
                title="Cinema-first. Built to explore beyond one lane."
                sub="Slater Media Company was born from a simple vision — to create cinema, not just content."
              />

              <div className="mt-8 space-y-4 text-white/70">
                <p>What started in video quickly became something bigger.</p>
                <p>
                  Because whether it’s a wedding, a home, a brand, or a business
                  — the moments that matter deserve more than surface-level
                  execution. They deserve intention. Craft. Story.
                </p>
                <p>
                  We began behind the camera, chasing light, movement, and
                  emotion. But creativity doesn’t live in one lane — and neither
                  do we.
                </p>

                <div className="space-y-2 pt-2">
                  <p className="text-white/85 font-semibold">So we expanded.</p>
                  <p>Into design.</p>
                  <p>Into development.</p>
                  <p>Into systems that bring ideas to life and help them grow.</p>
                </div>

                <p>
                  Today, SMC blends cinematic storytelling with modern digital
                  infrastructure — building experiences that look elite and
                  function seamlessly.
                </p>
                <p>
                  Some clients come to us for a once-in-a-lifetime moment. Others
                  come to build something long-term.
                </p>

                <p className="text-white/85 font-semibold">
                  Both deserve the same standard.
                </p>

                <div className="pt-4 text-white font-semibold">
                  <p>One vision.</p>
                  <p>One level of execution.</p>
                  <p>Built to create. Built to explore. Built to last.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#showroom"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
                >
                  See Work <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/insider-access"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Work With Us <Rocket className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="md:col-span-6">
              <div className="grid gap-5">
                <Card
                  icon={Video}
                  title="Cinematic Production"
                  desc="Weddings, real estate, brand stories — crafted with intention and emotion."
                  bullets={[
                    "Wedding films + highlight reels",
                    "Real estate video + photo",
                    "Commercials, reels, storytelling",
                  ]}
                />
                <Card
                  icon={Code2}
                  title="Web + App Development"
                  desc="Modern sites and products that look elite and run clean."
                  bullets={[
                    "Next.js web builds",
                    "Mobile apps (Flutter)",
                    "Integrations, payments, automation",
                  ]}
                />
                <Card
                  icon={Megaphone}
                  title="Creative Direction"
                  desc="A consistent visual standard across the whole experience."
                  bullets={[
                    "Brand identity + design systems",
                    "Launch content + campaigns",
                    "Strategy that matches the story",
                  ]}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DIFFERENCE */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <SectionTitle
            kicker="DIFFERENCE"
            title="Why SMC feels different"
            sub="Most teams do one thing well. We connect the whole experience — so everything feels intentional, premium, and consistent."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Card
              icon={Layers}
              title="One vision across everything"
              desc="Same creative standard from the first shot to the final build."
              bullets={[
                "Story + design + build aligned",
                "No handoff chaos",
                "Clean, premium consistency",
              ]}
            />
            <Card
              icon={ShieldCheck}
              title="Craft over shortcuts"
              desc="Details matter. We aim for cinema-level polish across every deliverable."
              bullets={[
                "High-end editing + finishing",
                "Performance-minded builds",
                "Intentional decisions only",
              ]}
            />
            <Card
              icon={Rocket}
              title="Built to last"
              desc="Whether it’s a moment or a platform — it should hold up over time."
              bullets={[
                "Evergreen quality",
                "Systems that scale",
                "Long-term support mindset",
              ]}
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <SectionTitle
            kicker="PROCESS"
            title="A simple system that keeps things moving"
            sub="Clear steps, fast progress, and a standard you can feel."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              { n: "01", t: "Align", d: "Vision, goals, vibe, and constraints." },
              { n: "02", t: "Create", d: "Shoot, design, and craft the story." },
              { n: "03", t: "Build", d: "Web/app + delivery systems when needed." },
              { n: "04", t: "Deliver", d: "Final polish + launch + handoff." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="text-xs font-semibold tracking-widest text-white/60">
                  {s.n}
                </div>
                <div className="mt-2 text-lg font-semibold">{s.t}</div>
                <div className="mt-2 text-sm text-white/70">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_100px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute -inset-40 opacity-70">
              <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.18),transparent_60%)] blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.14),transparent_62%)] blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.11),transparent_64%)] blur-3xl" />
            </div>

            <div className="relative grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <h3 className="text-3xl font-semibold tracking-tight">
                  Ready to build something that feels cinematic —
                  <span className="text-white/80"> and holds up?</span>
                </h3>
                <p className="mt-3 text-white/70">
                  Tell us what you’re making. We’ll map the cleanest path from
                  idea → creation → delivery.
                </p>
              </div>
              <div className="md:col-span-4 md:justify-self-end">
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Link
                    href="/insider-access"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition"
                  >
                    Insider Access <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    Email Us <Mail className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-80 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_26px_rgba(0,180,255,0.26)]" />
          </div>

          <p className="mt-8 text-center text-xs text-white/40">
            © {new Date().getFullYear()} Slater Media Company — The Creatives
            Express
          </p>
        </div>
      </section>
    </main>
  );
}




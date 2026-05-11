"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(140,80,255,0.16),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:60px_60px]" />

      <div className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              SMC Marketing
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Most marketing looks busy.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Ours builds momentum.
              </span>
            </h1>

            <p className="mt-6 text-white/70 text-lg leading-7">
              We don’t just post content or run ads. We build systems that
              combine creative, strategy, and distribution so your business
              actually grows.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/contact"
                className="bg-white text-black px-6 py-3 rounded-2xl font-medium flex items-center gap-2"
              >
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/showroom"
                className="border border-white/15 px-6 py-3 rounded-2xl"
              >
                View Work
              </Link>
            </div>
          </motion.div>
        </section>

        {/* PROBLEM */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Most businesses don’t have a marketing problem.
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              They have a system problem.
            </p>

            <p className="mt-6 text-white/60 leading-7">
              Random posts. Inconsistent content. Ads with no real creative
              direction. No clear path from attention to conversion.
              <br /><br />
              That’s why nothing compounds.
            </p>
          </div>
        </section>

        {/* EDGE */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-semibold">
                We connect creative + execution.
              </h2>

              <p className="mt-6 text-white/70 leading-7">
                Most agencies are either creative or analytical. We operate in
                both.
                <br /><br />
                Cinematic content that actually feels premium — backed by real
                distribution, targeting, and strategy.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-white/60 text-sm uppercase tracking-wider">
                The SMC Difference
              </p>

              <ul className="mt-6 space-y-4 text-white/80">
                <li>• High-end content production</li>
                <li>• Structured monthly execution</li>
                <li>• Paid + organic combined</li>
                <li>• Built for long-term growth</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold">
            What we actually do
          </h2>

          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              "Content Production",
              "Paid Advertising",
              "SEO & Local Growth",
              "Social Media Management",
              "Brand Messaging",
              "Analytics & Optimization",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold">{item}</h3>
                <p className="mt-3 text-sm text-white/60">
                  Built to drive real visibility and measurable growth.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold">
            How it works
          </h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Strategy",
                desc: "We define positioning, content direction, and growth targets.",
              },
              {
                title: "2. Execution",
                desc: "We produce, publish, and distribute content consistently.",
              },
              {
                title: "3. Optimization",
                desc: "We track performance and refine what works.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Let’s build something that actually grows.
            </h2>

            <p className="mt-4 text-white/70">
              Not just content. Not just ads. A system.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex bg-white text-black px-6 py-3 rounded-2xl font-medium items-center gap-2"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
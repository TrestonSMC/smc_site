"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Lock, Sparkles } from "lucide-react";

const PASSWORD = "SMC+users";
const SESSION_KEY = "smc_insider_unlock";

export default function InsiderAccessPage() {
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved === "true") setAuthorized(true);
    } catch {}
  }, []);

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const lock = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setAuthorized(false);
    setCode("");
    setError(false);
  };

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  return (
    <main className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* Cinematic background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.video
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 22, ease: "linear" }}
          className="h-full w-full object-cover brightness-[0.62] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_45%)]" />
      </div>

      <div className="relative z-10">
        {/* SMC-style nav bar */}
        <header className="relative w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(0,180,255,0.85)] shadow-[0_0_20px_rgba(0,180,255,0.65)]" />
          <div className="bg-black/50 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6">
              <div className="relative flex h-[120px] items-center">
                {/* Left */}
                <div className="hidden md:flex flex-1 items-center justify-start gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-black/60 transition"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </Link>
                </div>

                {/* Center logo */}
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

                {/* Right */}
                <div className="hidden md:flex flex-1 items-center justify-end gap-3">
                  {authorized ? (
                    <button
                      type="button"
                      onClick={lock}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] bg-black/40 px-5 py-2 text-sm font-semibold text-white/85 hover:bg-black/60 transition shadow-[0_0_18px_rgba(212,175,55,0.12)]"
                      title="Lock this page"
                    >
                      <Lock className="h-4 w-4" />
                      Lock
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.25)] bg-black/35 px-5 py-2 text-sm font-semibold text-white/70 shadow-[0_0_18px_rgba(212,175,55,0.10)]">
                      <Lock className="h-4 w-4" />
                      Private
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Gold private room card */}
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative rounded-[36px] border border-[rgba(212,175,55,0.36)] bg-white/[0.04] backdrop-blur-xl p-10 md:p-14
                         shadow-[0_30px_110px_rgba(0,0,0,0.75),0_0_0_1px_rgba(212,175,55,0.12),0_0_50px_rgba(212,175,55,0.14)]"
            >
              {/* Subtle gold glow edge */}
              <div
                className="pointer-events-none absolute -inset-px rounded-[36px] opacity-70"
                style={{
                  background:
                    "radial-gradient(900px circle at 25% 0%, rgba(212,175,55,0.18), transparent 55%)",
                }}
              />

              {!authorized ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[rgba(212,175,55,0.88)] font-semibold">
                    <Lock className="h-4 w-4" />
                    RESTRICTED
                  </div>

                  <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                    Insider Access
                  </h1>

                  <p className="mt-5 text-white/72 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                    Access our world
                    <br />
                  The newest release from Slater Media Company — built to redefine how you experience content.
                   Get early access to development projects, private SMC drops, curated resources, and more.
                    <br />
                    <span className="text-white/85 font-semibold">
                      Entry requires a valid access code.
                    </span>
                  </p>

                  <form onSubmit={unlock} className="mt-10 max-w-md mx-auto space-y-4">
                    <input
                      type="password"
                      placeholder="Enter access code"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setError(false);
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white
                                 placeholder:text-white/30 outline-none focus:border-[rgba(212,175,55,0.55)] transition"
                    />

                    {error && (
                      <div className="text-sm text-red-400">Incorrect code.</div>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-full border border-[rgba(212,175,55,0.50)] bg-black/40 px-6 py-3 text-sm font-semibold text-white
                                 hover:bg-black/60 transition shadow-[0_0_24px_rgba(212,175,55,0.18)]"
                    >
                      Enter →
                    </button>

                    <div className="text-xs text-white/40">
                      Access is limited by design.
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[rgba(212,175,55,0.88)] font-semibold">
                    <Sparkles className="h-4 w-4" />
                    INSIDER ROOM
                  </div>

                  <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                    Welcome Inside
                  </h1>

                  <p className="mt-5 text-white/72 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                    Quiet wins live here.
                    <br />
                    Strategy, execution, and the work behind the work — kept private for a reason.
                  </p>

                  <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.35)] to-transparent" />

                  {/* Placeholder for future insider content */}
                  <div className="mt-10 text-sm text-white/60">
                    Insider content placeholder — build this out next.
                  </div>
                </div>
              )}

              <div className="mt-14 text-center text-xs text-white/35">
                © {new Date().getFullYear()} Slater Media Company
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}








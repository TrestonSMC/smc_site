// src/app/showroom/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Film, Play, Sparkles, ChevronRight } from "lucide-react";
import type { ShowroomCategory, ShowroomItem, ShowroomSubcategory } from "@/lib/showroom";
import { showroomItems } from "@/lib/showroom";

/* -------------------- utils -------------------- */
function cx(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function prettySubcat(s: ShowroomSubcategory) {
  switch (s) {
    case "reels":
      return "Reels";
    case "weddings":
      return "Weddings";
    case "content":
      return "Content";
    case "featured":
      return "Featured";
    default:
      return s;
  }
}

function glowBySubcat(sub: ShowroomSubcategory) {
  switch (sub) {
    case "reels":
      return "shadow-[0_0_0_1px_rgba(236,72,153,0.16),0_18px_70px_rgba(0,0,0,0.40),0_0_34px_rgba(168,85,247,0.20)]";
    case "weddings":
      return "shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_18px_70px_rgba(0,0,0,0.40),0_0_34px_rgba(234,179,8,0.16)]";
    case "content":
      return "shadow-[0_0_0_1px_rgba(34,211,238,0.16),0_18px_70px_rgba(0,0,0,0.40),0_0_34px_rgba(59,130,246,0.14)]";
    case "featured":
      return "shadow-[0_0_0_1px_rgba(34,197,94,0.16),0_18px_70px_rgba(0,0,0,0.40),0_0_34px_rgba(16,185,129,0.14)]";
    default:
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_70px_rgba(0,0,0,0.40),0_0_28px_rgba(255,255,255,0.08)]";
  }
}

function accentGradientBySubcat(sub: ShowroomSubcategory) {
  switch (sub) {
    case "reels":
      return "from-fuchsia-500/22 via-pink-500/10 to-transparent";
    case "weddings":
      return "from-amber-500/22 via-yellow-500/10 to-transparent";
    case "content":
      return "from-cyan-500/22 via-blue-500/10 to-transparent";
    case "featured":
      return "from-emerald-500/22 via-lime-500/10 to-transparent";
    default:
      return "from-white/12 via-white/6 to-transparent";
  }
}

/* -------------------- motion (instant on mobile) -------------------- */
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {},
};

/* -------------------- UI bits -------------------- */
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
    {children}
  </span>
);

function Stars({ reduceMotion }: { reduceMotion: boolean }) {
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
}

/* -------------------- intersection helper -------------------- */
function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(!!entry?.isIntersecting);
      },
      { root: null, threshold: 0.12, rootMargin: "600px 0px", ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

/* -------------------- performant video tile -------------------- */
/**
 * Goals:
 * - "Show instantly": remove whileInView gating + heavy motion entrances.
 * - Fast preview: poster immediately + lazy load actual video when tile is near viewport.
 * - Desktop hover preview: play on hover (only after loaded).
 * - Mobile: no hover => tap = open modal; still preloads when near viewport for instant modal play.
 */
function VideoTile({
  item,
  onOpen,
  size = "md",
  priority = false,
}: {
  item: ShowroomItem;
  onOpen: (item: ShowroomItem) => void;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const wrap = useInView<HTMLDivElement>({ rootMargin: priority ? "1200px 0px" : "800px 0px" });
  const vRef = useRef<HTMLVideoElement | null>(null);

  const [shouldLoad, setShouldLoad] = useState(priority);
  const [canPlay, setCanPlay] = useState(false);

  // lazy-attach src only when near viewport (or priority)
  useEffect(() => {
    if (priority) return;
    if (!wrap.inView) return;
    setShouldLoad(true);
  }, [wrap.inView, priority]);

  // mark when the browser can actually play
  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    const onCanPlay = () => setCanPlay(true);
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [shouldLoad]);

  const onEnter = useCallback(() => {
    const v = vRef.current;
    if (!v || !canPlay) return;
    try {
      v.currentTime = 0;
      v.play().catch(() => {});
    } catch {}
  }, [canPlay]);

  const onLeave = useCallback(() => {
    const v = vRef.current;
    if (!v) return;
    try {
      v.pause();
      // free a bit of work on mobile/low-end
      v.currentTime = 0;
    } catch {}
  }, []);

  const aspect =
    size === "lg" ? "aspect-[16/9]" : size === "sm" ? "aspect-[16/10]" : "aspect-video";

  return (
    <div ref={wrap.ref} className="w-full">
      <button
        type="button"
        onClick={() => onOpen(item)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={cx(
          "group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left backdrop-blur",
          "transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
          glowBySubcat(item.subcategory)
        )}
        aria-label="Open video"
      >
        {/* subtle neon sweep */}
        <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.18),transparent_58%)] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.14),transparent_60%)] blur-2xl" />
        </div>

        <div className={cx("relative w-full bg-black/35", aspect)}>
          {/* Poster FIRST (instant). If you have posters per item, set item.poster in your data.
              Otherwise this keeps the tile from looking "empty" while metadata loads. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/5" />

          {/* Actual video (loads only when near viewport / priority) */}
          <video
            ref={vRef}
            // src only when shouldLoad to avoid network spam + stalls
            src={shouldLoad ? item.src : undefined}
            // preload metadata is enough for instant hover play once near viewport
            preload={priority ? "auto" : shouldLoad ? "metadata" : "none"}
            muted
            playsInline
            loop
            // object-cover feels faster/cleaner for previews than contain
            className={cx(
              "relative h-full w-full object-cover transform-gpu",
              // when not loaded yet, keep it hidden so the poster bg shows clean
              shouldLoad ? "opacity-100" : "opacity-0"
            )}
            onError={() => {
              // fail silently; poster/bg stays
              setCanPlay(false);
            }}
          />

          {/* overlays */}
          <div
            className={cx(
              "pointer-events-none absolute inset-0 bg-gradient-to-br",
              accentGradientBySubcat(item.subcategory)
            )}
          />

          {/* badge */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs text-white/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-white/70" />
            {prettySubcat(item.subcategory)}
          </div>

          {/* play */}
          <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white/85 backdrop-blur transition group-hover:scale-[1.03]">
            <Play className="h-5 w-5" />
          </div>
        </div>

        {/* neon hairline */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_22px_rgba(0,180,255,0.22)]" />
      </button>
    </div>
  );
}

function Row({
  title,
  subtitle,
  items,
  onOpen,
}: {
  title: string;
  subtitle: string;
  items: ShowroomItem[];
  onOpen: (item: ShowroomItem) => void;
}) {
  if (!items.length) return null;

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest text-white/60">COLLECTION</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{title}</div>
          <div className="mt-2 text-sm text-white/70">{subtitle}</div>
        </div>
      </div>

      <div className="mt-6 -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-5 pb-2 snap-x snap-mandatory">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="w-[320px] sm:w-[360px] md:w-[420px] shrink-0 snap-start"
            >
              <VideoTile item={it} onOpen={onOpen} size="sm" priority={idx < 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShowroomPage() {
  const reduceMotion = useReducedMotion();

  const [openItem, setOpenItem] = useState<ShowroomItem | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Video only for now
  const videoOnlyItems = useMemo(() => {
    return showroomItems.filter((i) => i.category === ("video" as ShowroomCategory));
  }, []);

  // Spotlight (first 3 featured; fallback to first 3 video)
  const featuredItems = useMemo(() => {
    const feats = videoOnlyItems.filter((i) => i.subcategory === "featured");
    return (feats.length ? feats : videoOnlyItems).slice(0, 3);
  }, [videoOnlyItems]);

  // Rows
  const reelsPicks = useMemo(
    () => videoOnlyItems.filter((i) => i.subcategory === "reels").slice(0, 12),
    [videoOnlyItems]
  );
  const contentPicks = useMemo(
    () => videoOnlyItems.filter((i) => i.subcategory === "content").slice(0, 12),
    [videoOnlyItems]
  );
  const weddingPicks = useMemo(
    () => videoOnlyItems.filter((i) => i.subcategory === "weddings").slice(0, 12),
    [videoOnlyItems]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
        <Stars reduceMotion={!!reduceMotion} />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-10 md:pt-32">
          {/* INSTANT: no whileInView gating */}
          <motion.div initial="visible" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <div className="flex flex-wrap gap-3">
                <Pill>
                  <Film className="h-4 w-4 text-white/80" />
                  Showroom
                </Pill>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                Work that feels cinematic.
                <span className="block text-white/80">Scroll. Hover. Click.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-white/70">
                A curated vault of SMC video work — spotlight pieces up top and collections below.
              </p>

              {/* ✅ Only Explore Services */}
              <div className="mt-7">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Explore Services <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* SPOTLIGHT */}
            <motion.div variants={fadeUp} className="mt-10">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-widest text-white/60">SPOTLIGHT</div>
                  <div className="text-xs text-white/60">Hover to preview • Click to open</div>
                </div>

                <div className="mt-4 grid gap-5 lg:grid-cols-12">
                  {/* big */}
                  <div className="lg:col-span-7">
                    {featuredItems[0] ? (
                      <VideoTile item={featuredItems[0]} onOpen={setOpenItem} size="lg" priority />
                    ) : null}
                  </div>

                  {/* stacked */}
                  <div className="lg:col-span-5 grid gap-5">
                    {featuredItems[1] ? (
                      <VideoTile item={featuredItems[1]} onOpen={setOpenItem} size="sm" priority />
                    ) : null}
                    {featuredItems[2] ? (
                      <VideoTile item={featuredItems[2]} onOpen={setOpenItem} size="sm" priority />
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* COLLECTION ROWS */}
            <motion.div variants={fadeUp} className="mt-6">
              <Row
                title="Reels"
                subtitle="Short-form edits built for attention."
                items={reelsPicks}
                onOpen={setOpenItem}
              />
              <Row
                title="Content"
                subtitle="Brand content, promos, and story-driven edits."
                items={contentPicks}
                onOpen={setOpenItem}
              />
              <Row
                title="Weddings"
                subtitle="Cinematic wedding work and emotional storytelling."
                items={weddingPicks}
                onOpen={setOpenItem}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {openItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpenItem(null);
            }}
          >
            <motion.div
              className={cx(
                "relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950",
                glowBySubcat(openItem.subcategory)
              )}
              initial={{ y: 10, opacity: 0, scale: 0.99 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.99 }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="text-xs text-white/60">{prettySubcat(openItem.subcategory)}</div>

                <button
                  type="button"
                  onClick={() => setOpenItem(null)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:border-white/20 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <video
                    src={openItem.src}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="h-full w-full max-h-[75vh] object-contain"
                  />
                  <div
                    className={cx(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br",
                      accentGradientBySubcat(openItem.subcategory)
                    )}
                  />
                </div>

                {openItem.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {openItem.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs text-white/50">Tip: hover tiles for preview • press ESC to close</div>
                  <Link
                    href="/insider-access"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    Insider Access <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-80 bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_26px_rgba(0,180,255,0.26)]" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <footer className="relative pb-10 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Slater Media Company — The Creatives Express
      </footer>
    </main>
  );
}











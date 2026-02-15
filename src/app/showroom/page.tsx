"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Film, Layers, AppWindow, Filter, Play } from "lucide-react";
import type { ShowroomCategory, ShowroomItem, ShowroomSubcategory } from "@/lib/showroom";
import { showroomItems } from "@/lib/showroom";

type Tab = "all" | ShowroomCategory;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

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
    case "app-preview":
      return "App Preview";
    case "site":
      return "Sites";
    case "ui":
      return "UI";
    default:
      return s;
  }
}

function tabLabel(t: Tab) {
  return t === "all" ? "All" : t === "video" ? "Video" : t === "web" ? "Web" : "Apps";
}

function TabIcon({ tab }: { tab: Tab }) {
  if (tab === "all") return <Filter className="h-4 w-4" />;
  if (tab === "video") return <Film className="h-4 w-4" />;
  if (tab === "web") return <Layers className="h-4 w-4" />;
  return <AppWindow className="h-4 w-4" />;
}

/**
 * Color-coded glow by subcategory (no custom CSS, just Tailwind arbitrary shadows)
 * Tuned to feel "SMC neon" without being tacky.
 */
function glowBySubcat(sub: ShowroomSubcategory) {
  switch (sub) {
    case "reels":
      return "shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_0_34px_rgba(168,85,247,0.22)]";
    case "weddings":
      return "shadow-[0_0_0_1px_rgba(245,158,11,0.18),0_0_34px_rgba(234,179,8,0.18)]";
    case "content":
      return "shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_34px_rgba(59,130,246,0.16)]";
    case "featured":
      return "shadow-[0_0_0_1px_rgba(34,197,94,0.18),0_0_34px_rgba(16,185,129,0.16)]";
    case "app-preview":
      return "shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_0_34px_rgba(99,102,241,0.18)]";
    default:
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_28px_rgba(255,255,255,0.10)]";
  }
}

function accentGradientBySubcat(sub: ShowroomSubcategory) {
  switch (sub) {
    case "reels":
      return "from-fuchsia-500/25 via-pink-500/10 to-transparent";
    case "weddings":
      return "from-amber-500/25 via-yellow-500/10 to-transparent";
    case "content":
      return "from-cyan-500/25 via-blue-500/10 to-transparent";
    case "featured":
      return "from-emerald-500/25 via-lime-500/10 to-transparent";
    case "app-preview":
      return "from-blue-500/25 via-indigo-500/10 to-transparent";
    default:
      return "from-white/12 via-white/6 to-transparent";
  }
}

/**
 * Normal-format portfolio tile:
 * - Uses 16:9 for the card preview so everything feels "normal"
 * - object-contain so you don't crop work
 * - Hover = subtle animated glow + video preview plays muted
 */
function VideoTile({
  item,
  onOpen,
}: {
  item: ShowroomItem;
  onOpen: (item: ShowroomItem) => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  const onEnter = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const onLeave = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cx(
        "group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] text-left",
        "transition hover:border-white/20",
        glowBySubcat(item.subcategory)
      )}
      aria-label={`Open ${item.title}`}
    >
      {/* Preview */}
      <div className="relative aspect-video w-full bg-black/40">
        <video
          ref={ref}
          src={item.src}
          preload="metadata"
          muted
          playsInline
          loop
          className="h-full w-full object-contain"
        />

        {/* Color wash + vignette */}
        <div className={cx("pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent")} />
        <div className={cx("pointer-events-none absolute inset-0 bg-gradient-to-br", accentGradientBySubcat(item.subcategory))} />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 bg-white/5" />
        </div>

        {/* Badge */}
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs text-white/80 backdrop-blur">
          {prettySubcat(item.subcategory)}
        </div>

        {/* Play icon */}
        <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white/85 backdrop-blur transition group-hover:scale-[1.03]">
          <Play className="h-5 w-5" />
        </div>
      </div>

      {/* Meta */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">{item.title}</div>
            <div className="mt-1 text-xs text-white/60">
              {item.category === "video" ? "Video Content" : item.category === "web" ? "Web Development" : "App Development"}
            </div>
          </div>
          <div className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] text-white/70">
            MP4
          </div>
        </div>

        {item.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

export default function ShowroomPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [sub, setSub] = useState<ShowroomSubcategory | "all">("all");
  const [openItem, setOpenItem] = useState<ShowroomItem | null>(null);

  const availableSubs = useMemo(() => {
    const base = tab === "all" ? showroomItems : showroomItems.filter((i) => i.category === tab);
    const subs = Array.from(new Set(base.map((i) => i.subcategory)));

    const order: ShowroomSubcategory[] = ["featured", "reels", "content", "weddings", "app-preview", "site", "ui"];
    subs.sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return subs;
  }, [tab]);

  const filtered = useMemo(() => {
    return showroomItems.filter((i) => {
      if (tab !== "all" && i.category !== tab) return false;
      if (sub !== "all" && i.subcategory !== sub) return false;
      return true;
    });
  }, [tab, sub]);

  // keep subfilter valid when switching tabs
  useMemo(() => {
    if (sub !== "all" && !availableSubs.includes(sub)) setSub("all");
  }, [availableSubs, sub]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Showroom</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                A curated vault of work across video, web, and app builds.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "video", "web", "app"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setSub("all");
                  }}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                    t === tab
                      ? "border-white/25 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                  )}
                >
                  <TabIcon tab={t} />
                  {tabLabel(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSub("all")}
              className={cx(
                "rounded-full border px-4 py-2 text-xs transition",
                sub === "all"
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
              )}
            >
              All
            </button>

            {availableSubs.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSub(s)}
                className={cx(
                  "rounded-full border px-4 py-2 text-xs transition",
                  sub === s
                    ? "border-white/25 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                )}
              >
                {prettySubcat(s)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <motion.div key={item.id} variants={fadeUp}>
              <VideoTile item={item} onOpen={setOpenItem} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modal */}
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
              initial={{ y: 18, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.985 }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold">{openItem.title}</div>
                  <div className="mt-0.5 text-xs text-white/60">
                    {prettySubcat(openItem.subcategory)} • {openItem.category.toUpperCase()}
                  </div>
                </div>

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
                    className="h-full w-full max-h-[75vh] object-contain"
                  />
                  <div className={cx("pointer-events-none absolute inset-0 bg-gradient-to-br", accentGradientBySubcat(openItem.subcategory))} />
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
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}


"use client";

import { useEffect, useMemo, useState } from "react";

type ShowroomItem = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  kind: string;
  src: string;
  thumbnail?: string | null;
  tags?: string[] | null;
  description?: string | null;
  is_published?: boolean;
  created_at?: string;
};

type ApiResponse = {
  items?: ShowroomItem[];
  error?: string;
};

export default function AdminManagePage() {
  const [adminKey, setAdminKey] = useState("");
  const [items, setItems] = useState<ShowroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bd - ad;
    });
  }, [items]);

  const loadItems = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/showroom", { cache: "no-store" });
      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load showroom items.");
      }

      setItems(data.items || []);
    } catch (error: any) {
      setMessage(error?.message || "Failed to load showroom items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const deleteItem = async (id: string) => {
    if (!adminKey.trim()) {
      setMessage("Enter your admin upload key first.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this showroom item, its video, and thumbnail?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      const res = await fetch("/api/admin/showroom-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-upload-key": adminKey,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed.");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Item deleted.");
    } catch (error: any) {
      setMessage(error?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute -top-52 left-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 right-[5%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-52 left-[35%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                SMC Manage Showroom
              </h1>
              <p className="mt-2 text-white/65">
                View uploaded items and delete anything you no longer want live.
              </p>
            </div>

            <button
              type="button"
              onClick={loadItems}
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-white/85">
              Admin Upload Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="Enter private key"
            />
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              {message}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 text-white/60">Loading showroom items...</div>
          ) : sortedItems.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 px-4 py-6 text-white/60">
              No showroom items found.
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-4 md:grid-cols-[220px_1fr]"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="aspect-video h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-white/35">
                        No thumbnail
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-lg font-semibold text-white">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-white/50">
                          {item.category} • {item.subcategory} • {item.kind}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/15 transition disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                    {item.description ? (
                      <p className="mt-4 text-sm leading-relaxed text-white/70">
                        {item.description}
                      </p>
                    ) : null}

                    {item.tags?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-3 text-xs text-white/55">
                      <div>
                        <span className="font-semibold text-white/75">ID:</span>{" "}
                        {item.id}
                      </div>
                      <div className="break-all">
                        <span className="font-semibold text-white/75">Video:</span>{" "}
                        {item.src}
                      </div>
                      {item.thumbnail ? (
                        <div className="break-all">
                          <span className="font-semibold text-white/75">
                            Thumbnail:
                          </span>{" "}
                          {item.thumbnail}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
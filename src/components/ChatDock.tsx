"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      role: "assistant",
      content:
        "Hey — I’m SMC Assist. Ask me about services, content creation, web/app dev, or how to get started.",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(t);
  }, [open, messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat request failed");

      setMessages((m) => [...m, { role: "assistant", content: data.answer || "…" }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry — I hit a snag. If this keeps happening, we may need to check the API keys or that the knowledge base has embeddings.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md hover:bg-black/80"
        aria-label="Open chat"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          <span className="pointer-events-none absolute -inset-1 rounded-full blur-md opacity-60 [background:radial-gradient(circle,rgba(255,255,255,0.35),transparent_60%)]" />
        </span>
        <span className="hidden text-sm font-semibold sm:inline">
          {open ? "Close" : "SMC Assist"}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[60] w-[92vw] max-w-[420px] overflow-hidden rounded-3xl border border-white/15 bg-black/70 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">SMC Assist</div>
                <div className="text-xs text-white/65">
                  Answers from Slater Media Company content
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Close
            </button>

            {/* glow */}
            <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(900px_300px_at_20%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
          </div>

          <div
            ref={listRef}
            className="max-h-[52vh] space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/90"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/70">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask about services, pricing, booking…"
                className="min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/20"
              />
              <button
                onClick={send}
                disabled={!canSend}
                className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 text-[11px] text-white/45">
              Tip: Press Enter to send • Shift+Enter for a new line
            </div>
          </div>
        </div>
      )}
    </>
  );
}

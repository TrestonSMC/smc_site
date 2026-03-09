"use client";

import { useMemo, useRef, useState } from "react";

type UploadResult = {
  ok: boolean;
  item?: {
    id: string;
    title: string;
    category: string;
    subcategory: string;
    kind: string;
    src: string;
    thumbnail: string;
    tags: string[];
    description?: string;
  };
  error?: string;
};

export default function AdminUploadPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [adminKey, setAdminKey] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState("");
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"video" | "web" | "app">("video");
  const [subcategory, setSubcategory] = useState("reels");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("Reels, Vertical");
  const [thumbSecond, setThumbSecond] = useState(3);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const subcategoryOptions = useMemo(() => {
    if (category === "video") return ["reels", "weddings", "content", "featured"];
    if (category === "app") return ["app-preview", "ui"];
    return ["site", "ui"];
  }, [category]);

  const onPickVideo = (file: File) => {
    setVideoFile(file);
    setResult(null);
    setThumbnailBlob(null);
    setThumbnailPreviewUrl("");

    const url = URL.createObjectURL(file);
    setVideoObjectUrl(url);

    if (!title) {
      const cleaned = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleaned);
    }
  };

  const generateThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current || !videoFile) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Could not seek video."));
        };
        const cleanup = () => {
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
        };

        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.currentTime = Math.max(0, Number(thumbSecond) || 0);
      });

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.86);
      });

      if (!blob) {
        setResult({
          ok: false,
          error: "Could not generate thumbnail.",
        });
        return;
      }

      setThumbnailBlob(blob);
      setThumbnailPreviewUrl(URL.createObjectURL(blob));
      setResult(null);
    } catch (error: any) {
      setResult({
        ok: false,
        error: error?.message || "Thumbnail generation failed.",
      });
    }
  };

  const upload = async () => {
    if (!adminKey.trim()) {
      setResult({ ok: false, error: "Enter your admin upload key." });
      return;
    }

    if (!videoFile) {
      setResult({ ok: false, error: "Pick a video first." });
      return;
    }

    if (!thumbnailBlob) {
      setResult({ ok: false, error: "Generate the thumbnail first." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append("video", videoFile, videoFile.name);
      form.append("thumbnail", thumbnailBlob, "thumbnail.jpg");
      form.append("title", title);
      form.append("category", category);
      form.append("subcategory", subcategory);
      form.append("kind", "video");
      form.append("description", description);
      form.append("tags", tags);

      const res = await fetch("/api/admin/showroom-upload", {
        method: "POST",
        headers: {
          "x-admin-upload-key": adminKey,
        },
        body: form,
      });

      let data: UploadResult | null = null;
      let rawText = "";

      try {
        rawText = await res.text();
        data = rawText ? (JSON.parse(rawText) as UploadResult) : null;
      } catch {
        data = {
          ok: false,
          error: rawText || `Upload failed with status ${res.status}`,
        };
      }

      setResult(data);

      if (!res.ok) {
        throw new Error(data?.error || `Upload failed with status ${res.status}`);
      }
    } catch (error: any) {
      setResult({
        ok: false,
        error: error?.message || "Upload failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">SMC Private Upload</h1>
        <p className="mt-2 text-white/65">
          Upload video, auto-generate thumbnail, and save directly to Supabase.
        </p>

        <div className="mt-8 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Admin Upload Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="Enter private key"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Video File
            </label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPickVideo(file);
              }}
              className="block w-full text-sm text-white/80 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
            />
          </div>

          {videoObjectUrl ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <video
                ref={videoRef}
                src={videoObjectUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-2xl bg-black"
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                placeholder="Featured Client"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                placeholder="Client, Featured"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const next = e.target.value as "video" | "web" | "app";
                  setCategory(next);
                  if (next === "video") setSubcategory("reels");
                  if (next === "app") setSubcategory("app-preview");
                  if (next === "web") setSubcategory("site");
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              >
                <option value="video">video</option>
                <option value="app">app</option>
                <option value="web">web</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              >
                {subcategoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="Short description..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">
                Thumbnail Second
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={thumbSecond}
                onChange={(e) => setThumbSecond(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
              />
            </div>

            <button
              type="button"
              onClick={generateThumbnail}
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
            >
              Generate Thumbnail
            </button>
          </div>

          {thumbnailPreviewUrl ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <div className="mb-3 text-sm font-medium text-white/85">Thumbnail Preview</div>
              <img
                src={thumbnailPreviewUrl}
                alt="Thumbnail preview"
                className="max-h-[320px] rounded-2xl border border-white/10"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={upload}
              disabled={loading}
              className="rounded-2xl border border-white/15 bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500/25 transition disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload to Supabase"}
            </button>
          </div>

          {result?.error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 whitespace-pre-wrap break-words">
              {result.error}
            </div>
          ) : null}

          {result?.ok && result.item ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-lg font-semibold text-white">Upload complete</div>

              <div className="mt-4 grid gap-3 text-sm text-white/80">
                <div>
                  <span className="font-semibold text-white">ID:</span> {result.item.id}
                </div>
                <div>
                  <span className="font-semibold text-white">Video:</span>
                  <div className="mt-1 break-all text-white/65">{result.item.src}</div>
                </div>
                <div>
                  <span className="font-semibold text-white">Thumbnail:</span>
                  <div className="mt-1 break-all text-white/65">
                    {result.item.thumbnail}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
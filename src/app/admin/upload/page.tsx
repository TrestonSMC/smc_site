"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as tus from "tus-js-client";

const BUCKET = "smc-media";
const PROJECT_REF = "zzfbfgouvouiwhjcncga";

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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

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

  const [videoDuration, setVideoDuration] = useState(0);
  const [thumbTime, setThumbTime] = useState(3);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);

  const subcategoryOptions = useMemo(() => {
    if (category === "video") return ["reels", "weddings", "content", "featured"];
    if (category === "app") return ["app-preview", "ui"];
    return ["site", "ui"];
  }, [category]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      setVideoDuration(duration);
      if (duration > 0) {
        setThumbTime(Math.min(3, Math.max(0, duration - 0.1)));
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [videoObjectUrl]);

  const onPickVideo = (file: File) => {
    setVideoFile(file);
    setResult(null);
    setThumbnailBlob(null);
    setThumbnailPreviewUrl("");
    setProgress(0);
    setProgressLabel("");

    const url = URL.createObjectURL(file);
    setVideoObjectUrl(url);

    if (!title) {
      const cleaned = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleaned);
    }
  };

  const seekVideo = async (time: number) => {
    const video = videoRef.current;
    if (!video) return;

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
      video.currentTime = Math.max(0, time);
    });
  };

  const generateThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current || !videoFile) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      await seekVideo(thumbTime);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.86);
      });

      if (!blob) {
        setResult({ ok: false, error: "Could not generate thumbnail." });
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

  const uploadVideoWithTus = async (file: File, path: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "No Supabase session found. Sign in first, or switch this uploader to signed upload URLs."
      );
    }

    const endpoint = `https://${PROJECT_REF}.storage.supabase.co/storage/v1/upload/resumable`;

    await new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: BUCKET,
          objectName: path,
          contentType: file.type || "video/mp4",
          cacheControl: "3600",
        },
        onError: (error) => reject(error),
        onProgress: (bytesUploaded, bytesTotal) => {
          const pct = Math.round((bytesUploaded / bytesTotal) * 100);
          setProgress(pct);
          setProgressLabel(`Uploading video… ${pct}%`);
        },
        onSuccess: () => resolve(),
      });

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
        upload.start();
      });
    });
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
    setProgress(0);
    setProgressLabel("Preparing upload…");

    try {
      const id = slugify(title || videoFile.name.replace(/\.[^/.]+$/, ""));
      const videoExt = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";

      const videoPath = `Videos/${id}.${videoExt}`;
      const thumbPath = `Thumbs/${id}.jpg`;

      await uploadVideoWithTus(videoFile, videoPath);

      setProgressLabel("Uploading thumbnail…");

      const { error: thumbErr } = await supabase.storage
        .from(BUCKET)
        .upload(thumbPath, thumbnailBlob, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (thumbErr) {
        throw new Error(`Thumbnail upload failed: ${thumbErr.message}`);
      }

      setProgress(100);
      setProgressLabel("Saving metadata…");

      const { data: videoPublicData } = supabase.storage.from(BUCKET).getPublicUrl(videoPath);
      const { data: thumbPublicData } = supabase.storage.from(BUCKET).getPublicUrl(thumbPath);

      const src = videoPublicData.publicUrl;
      const thumbnail = thumbPublicData.publicUrl;

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/showroom-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-upload-key": adminKey,
        },
        body: JSON.stringify({
          title,
          category,
          subcategory,
          kind: "video",
          description,
          src,
          thumbnail,
          tags: tagsArray,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Save failed.");
      }

      setProgressLabel("Done");
      setResult(data);
    } catch (error: any) {
      setResult({
        ok: false,
        error: error?.message || "Upload failed.",
      });
      setProgressLabel("");
    } finally {
      setLoading(false);
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

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.35)]">
          <h1 className="text-3xl font-semibold tracking-tight">SMC Private Upload</h1>
          <p className="mt-2 text-white/65">
            Upload video, scrub to a thumbnail frame, and save directly to Supabase.
          </p>

          <div className="mt-8 grid gap-6">
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

            {videoObjectUrl ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-white/85">Thumbnail Scrub</div>
                  <div className="text-xs text-white/60">
                    {formatTime(thumbTime)} / {formatTime(videoDuration)}
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={Math.max(videoDuration, 0)}
                  step={0.1}
                  value={thumbTime}
                  onChange={async (e) => {
                    const next = Number(e.target.value);
                    setThumbTime(next);
                    try {
                      await seekVideo(next);
                    } catch {}
                  }}
                  className="w-full accent-white"
                />

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={generateThumbnail}
                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
                  >
                    Generate Thumbnail
                  </button>
                </div>
              </div>
            ) : null}

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

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-2 text-sm text-white/80">{progressLabel || "Uploading…"}</div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-white/55">{progress}%</div>
              </div>
            ) : null}

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
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
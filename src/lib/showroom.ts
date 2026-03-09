// /lib/showroom.ts

export type ShowroomCategory = "video" | "web" | "app";

export type ShowroomSubcategory =
  | "reels"
  | "weddings"
  | "content"
  | "featured"
  | "app-preview"
  | "site"
  | "ui";

export type ShowroomItem = {
  id: string;
  title: string;
  category: ShowroomCategory;
  subcategory: ShowroomSubcategory;
  kind: "video" | "image" | "link";
  src: string;
  thumbnail?: string;
  tags?: string[];
  description?: string;
};

const SUPABASE_BASE = "https://zzfbfgouvouiwhjcncga.supabase.co";
const BUCKET = "smc-media";

/* ---------------- VIDEO URL ---------------- */

function videoUrl(filename: string) {
  return `${SUPABASE_BASE}/storage/v1/object/public/${BUCKET}/Videos/${encodeURIComponent(
    filename
  )}`;
}

/* ---------------- THUMB URL ---------------- */

function thumbUrl(filename: string) {
  return `${SUPABASE_BASE}/storage/v1/object/public/${BUCKET}/Thumbs/${encodeURIComponent(
    filename
  )}`;
}

/* ---------------- SHOWROOM ITEMS ---------------- */

export const showroomItems: ShowroomItem[] = [
  // Reels
  {
    id: "reel-1",
    title: "Reel 1",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: videoUrl("reel-1.mp4"),
    thumbnail: thumbUrl("reel-1.jpg"),
    tags: ["Reels", "Vertical"],
  },
  {
    id: "reel-2",
    title: "Reel 2",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: videoUrl("reel-2.mp4"),
    thumbnail: thumbUrl("reel-2.jpg"),
    tags: ["Reels", "Vertical"],
  },
  {
    id: "reel-3",
    title: "Reel 3",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: videoUrl("reel-3.mp4"),
    thumbnail: thumbUrl("reel-3.jpg"),
    tags: ["Reels", "Vertical"],
  },

  // Weddings
  {
    id: "wedding-1",
    title: "Wedding 1",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: videoUrl("wedding-1.mp4"),
    thumbnail: thumbUrl("wedding-1.jpg"),
    tags: ["Weddings"],
  },
  {
    id: "wedding-2",
    title: "Wedding 2",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: videoUrl("wedding-2.mp4"),
    thumbnail: thumbUrl("wedding-2.jpg"),
    tags: ["Weddings"],
  },
  {
    id: "wedding-3",
    title: "Wedding 3",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: videoUrl("wedding-3.mp4"),
    thumbnail: thumbUrl("wedding-3.jpg"),
    tags: ["Weddings"],
  },

  // Content
  {
    id: "content-1",
    title: "Content 1",
    category: "video",
    subcategory: "content",
    kind: "video",
    src: videoUrl("content-1.mp4"),
    thumbnail: thumbUrl("content-1.jpg"),
    tags: ["Content"],
  },

  {
    id: "featured-client",
    title: "Featured Client",
    category: "video",
    subcategory: "featured",
    kind: "video",
    src: videoUrl("featured-client.mp4"),
    thumbnail: thumbUrl("featured-client.jpg"),
    tags: ["Client", "Featured"],
  },

  // App preview
  {
    id: "smc-app-preview",
    title: "SMC App Preview",
    category: "app",
    subcategory: "app-preview",
    kind: "video",
    src: videoUrl("smc-app-preview.mp4"),
    thumbnail: thumbUrl("smc-app-preview.jpg"),
    tags: ["App", "Preview"],
  },
];

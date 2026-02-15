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
  src: string; // public URL (video/image)
  tags?: string[];
  description?: string;
  // later if you want:
  // href?: string; // for web projects
};

const SUPABASE_BASE = "https://zzfbfgouvouiwhjcncga.supabase.co";
const BUCKET = "smc-media";

function publicVideoUrl(objectKey: string) {
  // important for filenames like "reel 3.mp4" or "wedding 3.mp4"
  return `${SUPABASE_BASE}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(
    objectKey
  )}`;
}

// ✅ Showroom media (NO hero.mp4)
export const showroomItems: ShowroomItem[] = [
  // Reels
  {
    id: "reel-1",
    title: "Reel 1",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: publicVideoUrl("reel_1.mp4"),
    tags: ["Reels", "Vertical"],
  },
  {
    id: "reel-2",
    title: "Reel 2",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: publicVideoUrl("reel_2.mp4"),
    tags: ["Reels", "Vertical"],
  },
  {
    id: "reel-3",
    title: "Reel 3",
    category: "video",
    subcategory: "reels",
    kind: "video",
    src: publicVideoUrl("reel 3.mp4"),
    tags: ["Reels", "Vertical"],
  },

  // Weddings
  {
    id: "wedding-1",
    title: "Wedding 1",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: publicVideoUrl("wedding_1.mp4"),
    tags: ["Weddings"],
  },
  {
    id: "wedding-2",
    title: "Wedding 2",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: publicVideoUrl("wedding_2.mp4"),
    tags: ["Weddings"],
  },
  {
    id: "wedding-3",
    title: "Wedding 3",
    category: "video",
    subcategory: "weddings",
    kind: "video",
    src: publicVideoUrl("wedding 3.mp4"),
    tags: ["Weddings"],
  },

  // Content / Client Work
  {
    id: "content-1",
    title: "Content 1",
    category: "video",
    subcategory: "content",
    kind: "video",
    src: publicVideoUrl("content_1.mp4"),
    tags: ["Content"],
  },
  {
    id: "featured-client",
    title: "Featured Client",
    category: "video",
    subcategory: "featured",
    kind: "video",
    src: publicVideoUrl("featured-client.mp4"),
    tags: ["Client", "Featured"],
  },

  // App preview
  {
    id: "smc-app-preview",
    title: "SMC App Preview",
    category: "app",
    subcategory: "app-preview",
    kind: "video",
    src: publicVideoUrl("smc-app-preview.mp4"),
    tags: ["App", "Preview"],
  },
];

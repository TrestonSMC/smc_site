export const MEDIA_BASE =
  "https://zzfbfgouvouiwhjcncga.supabase.co/storage/v1/object/public/smc-media";

export const media = {
  heroVideo: `${MEDIA_BASE}/Videos/About-Hero.mp4`,
  heroPoster: `${MEDIA_BASE}/Thumbs/about-hero.jpg`,
  featuredClient: `${MEDIA_BASE}/Videos/choulet-teaser-b.mp4`,
  smcAppPreview: `${MEDIA_BASE}/Videos/smc-app-preview.mp4`,
} as const;
export const MEDIA_BASE =
  "https://zzfbfgouvouiwhjcncga.supabase.co/storage/v1/object/public/smc-media";

export const media = {
  heroVideo: `${MEDIA_BASE}/hero.mp4`,
  featuredClient: `${MEDIA_BASE}/featured-client.mp4`,
  smcAppPreview: `${MEDIA_BASE}/smc-app-preview.mp4`,
} as const;

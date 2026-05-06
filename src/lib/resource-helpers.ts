import type { Database } from "@/integrations/supabase/types";

export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type Devotional = Database["public"]["Tables"]["devotionals"]["Row"];
export type ResourceType = Database["public"]["Enums"]["resource_type"];
export type CityTag = Database["public"]["Enums"]["city_tag"];

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  sermon: "Sermone",
  article: "Articolo",
  video: "Video",
  podcast: "Podcast",
  pdf: "PDF",
};

export const CITY_TAG_LABELS: Record<CityTag, string> = {
  milano: "Milano",
  bologna: "Bologna",
  napoli: "Napoli",
  sicilia: "Palermo",
  national: "Nazionale",
};

export function formatItalianDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url);
}

export function isSpotifyUrl(url: string): boolean {
  return /spotify\.com/.test(url);
}

export function toEmbedUrl(url: string): string {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  // Spotify
  if (isSpotifyUrl(url) && !url.includes("/embed/")) {
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  }
  return url;
}

export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/**
 * Returns a preview image URL synchronously when possible (YouTube).
 * For Vimeo/Spotify, returns null — use fetchOEmbedThumbnail().
 */
export function getInstantThumbnail(mediaUrl: string | null | undefined): string | null {
  if (!mediaUrl) return null;
  const ytId = getYouTubeId(mediaUrl);
  if (ytId) return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
  return null;
}

const oembedCache = new Map<string, string | null>();

/**
 * Fetches a preview thumbnail via oEmbed for Vimeo/Spotify.
 * Cached in-memory per session.
 */
export async function fetchOEmbedThumbnail(mediaUrl: string): Promise<string | null> {
  if (oembedCache.has(mediaUrl)) return oembedCache.get(mediaUrl)!;

  let endpoint: string | null = null;
  if (isVimeoUrl(mediaUrl)) {
    endpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(mediaUrl)}`;
  } else if (isSpotifyUrl(mediaUrl)) {
    endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(mediaUrl)}`;
  }
  if (!endpoint) {
    oembedCache.set(mediaUrl, null);
    return null;
  }
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { thumbnail_url?: string };
    const thumb = data.thumbnail_url ?? null;
    oembedCache.set(mediaUrl, thumb);
    return thumb;
  } catch {
    oembedCache.set(mediaUrl, null);
    return null;
  }
}

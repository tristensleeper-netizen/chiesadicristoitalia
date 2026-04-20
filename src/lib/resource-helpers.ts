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
  sicilia: "Sicilia",
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

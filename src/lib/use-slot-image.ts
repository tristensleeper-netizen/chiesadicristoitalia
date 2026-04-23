import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Registry of every editable image slot on the site.
// Add new entries here when introducing a new slot in the UI.
export const MEDIA_SLOTS = {
  // Home page
  "home.hero": "Home — Hero principale",
  "home.milano": "Home — Tile Milano",
  "home.bologna": "Home — Tile Bologna",
  "home.napoli": "Home — Tile Napoli",
  "home.sicilia": "Home — Tile Sicilia",

  // Milano
  "milano.welcome": "Milano — Foto sezione benvenuto",
  "milano.bibleband": "Milano — Banda 'Venite a me'",
  "milano.photo1": "Milano — Galleria 1",
  "milano.photo2": "Milano — Galleria 2",
  "milano.photo3": "Milano — Galleria 3",
  "milano.photo4": "Milano — Galleria 4",

  // Bologna
  "bologna.welcome": "Bologna — Foto sezione benvenuto",
  "bologna.bibleband": "Bologna — Banda scrittura",
  "bologna.photo1": "Bologna — Galleria 1",
  "bologna.photo2": "Bologna — Galleria 2",
  "bologna.photo3": "Bologna — Galleria 3",
  "bologna.photo4": "Bologna — Galleria 4",

  // Napoli / Sicilia / pages
  "napoli.hero": "Napoli — Hero",
  "sicilia.hero": "Sicilia — Hero",
  "risorse.hero": "Risorse — Hero",
  "devozionale.hero": "Devozionale — Hero",
  "beliefs.hero": "Cosa crediamo — Hero (entrambe le città)",
  "sermons.hero": "Sermoni — Hero (entrambe le città)",
} as const;

export type SlotKey = keyof typeof MEDIA_SLOTS;

export type SlotMedia = {
  kind: "image" | "video";
  url: string;
  /** Embed url (YouTube/Vimeo) when external; same as url for uploaded videos. */
  external_url?: string | null;
  mime_type?: string | null;
  thumbnail_url?: string | null;
};

// ---- In-memory cache so repeated lookups don't refetch on every mount ----
let cachePromise: Promise<Record<string, SlotMedia>> | null = null;
let cache: Record<string, SlotMedia> | null = null;

async function loadAll(): Promise<Record<string, SlotMedia>> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const { data, error } = await supabase
      .from("media_slots")
      .select("slot_key, asset:asset_id(public_url, kind, external_url, mime_type, thumbnail_url)");
    if (error || !data) {
      cache = {};
      return cache;
    }
    const map: Record<string, SlotMedia> = {};
    for (const row of data as Array<{
      slot_key: string;
      asset: {
        public_url: string;
        kind: string;
        external_url: string | null;
        mime_type: string | null;
        thumbnail_url: string | null;
      } | null;
    }>) {
      if (!row.asset) continue;
      const a = row.asset;
      const kind = (a.kind === "video" ? "video" : "image") as "image" | "video";
      const url = a.external_url || a.public_url;
      if (!url) continue;
      map[row.slot_key] = {
        kind,
        url,
        external_url: a.external_url,
        mime_type: a.mime_type,
        thumbnail_url: a.thumbnail_url,
      };
    }
    cache = map;
    return cache;
  })();
  return cachePromise;
}

export function invalidateMediaSlotsCache() {
  cache = null;
  cachePromise = null;
}

/** Returns image URL for a slot, or fallback. Videos are skipped (use useSlotMedia for those). */
export function useSlotImage(slot: SlotKey, fallback: string): string {
  const initial = cache?.[slot];
  const [src, setSrc] = useState<string>(() =>
    initial && initial.kind === "image" ? initial.url : fallback,
  );

  useEffect(() => {
    let active = true;
    loadAll().then((map) => {
      if (!active) return;
      const m = map[slot];
      if (m && m.kind === "image") setSrc(m.url);
    });
    return () => {
      active = false;
    };
  }, [slot]);

  return src;
}

/** Returns full media (image or video) for a slot, or null when unset. */
export function useSlotMedia(slot: SlotKey): SlotMedia | null {
  const [media, setMedia] = useState<SlotMedia | null>(() => cache?.[slot] ?? null);

  useEffect(() => {
    let active = true;
    loadAll().then((map) => {
      if (!active) return;
      setMedia(map[slot] ?? null);
    });
    return () => {
      active = false;
    };
  }, [slot]);

  return media;
}

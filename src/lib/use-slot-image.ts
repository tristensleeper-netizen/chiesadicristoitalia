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

// ---- In-memory cache so repeated lookups don't refetch on every mount ----
let cachePromise: Promise<Record<string, string>> | null = null;
let cache: Record<string, string> | null = null;

async function loadAll(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const { data, error } = await supabase
      .from("media_slots")
      .select("slot_key, asset:asset_id(public_url)");
    if (error || !data) {
      cache = {};
      return cache;
    }
    const map: Record<string, string> = {};
    for (const row of data as Array<{ slot_key: string; asset: { public_url: string } | null }>) {
      if (row.asset?.public_url) map[row.slot_key] = row.asset.public_url;
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

/** Returns the override URL for a slot, or the fallback while loading / when no override is set. */
export function useSlotImage(slot: SlotKey, fallback: string): string {
  const [src, setSrc] = useState<string>(() => cache?.[slot] ?? fallback);

  useEffect(() => {
    let active = true;
    loadAll().then((map) => {
      if (!active) return;
      if (map[slot]) setSrc(map[slot]);
    });
    return () => {
      active = false;
    };
  }, [slot]);

  return src;
}

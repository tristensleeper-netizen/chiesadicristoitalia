import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  MEDIA_SLOTS,
  invalidateMediaSlotsCache,
  type SlotKey,
} from "@/lib/use-slot-image";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

type Asset = {
  id: string;
  storage_path: string;
  public_url: string;
  label: string | null;
  created_at: string;
};

type SlotRow = { slot_key: string; asset_id: string | null };

// Group slots by section for a tidy admin UI
const SLOT_GROUPS: { title: string; keys: SlotKey[] }[] = [
  { title: "Home (Italia)", keys: ["home.hero", "home.milano", "home.bologna", "home.napoli", "home.sicilia"] },
  { title: "Milano", keys: ["milano.welcome", "milano.bibleband", "milano.photo1", "milano.photo2", "milano.photo3", "milano.photo4"] },
  { title: "Bologna", keys: ["bologna.welcome", "bologna.bibleband", "bologna.photo1", "bologna.photo2", "bologna.photo3", "bologna.photo4"] },
  { title: "Napoli & Sicilia", keys: ["napoli.hero", "sicilia.hero"] },
  { title: "Pagine condivise", keys: ["risorse.hero", "devozionale.hero", "beliefs.hero", "sermons.hero"] },
];

function AdminMedia() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [slots, setSlots] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState<SlotKey | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const [a, s] = await Promise.all([
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
      supabase.from("media_slots").select("slot_key, asset_id"),
    ]);
    setAssets((a.data as Asset[]) ?? []);
    const map: Record<string, string | null> = {};
    for (const row of (s.data as SlotRow[]) ?? []) map[row.slot_key] = row.asset_id;
    setSlots(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("site-media").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("media_assets").insert({
        storage_path: path,
        public_url: pub.publicUrl,
        label: file.name,
      });
      if (dbErr) throw dbErr;
      invalidateMediaSlotsCache();
      load();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removeAsset = async (a: Asset) => {
    if (!confirm("Eliminare questa immagine dalla libreria? Gli slot che la usano torneranno al default.")) return;
    await supabase.storage.from("site-media").remove([a.storage_path]);
    const { error } = await supabase.from("media_assets").delete().eq("id", a.id);
    if (error) { alert(error.message); return; }
    invalidateMediaSlotsCache();
    load();
  };

  const assignSlot = async (slot: SlotKey, assetId: string | null) => {
    if (assetId === null) {
      const { error } = await supabase.from("media_slots").delete().eq("slot_key", slot);
      if (error) { alert(error.message); return; }
    } else {
      const { error } = await supabase
        .from("media_slots")
        .upsert({ slot_key: slot, asset_id: assetId }, { onConflict: "slot_key" });
      if (error) { alert(error.message); return; }
    }
    invalidateMediaSlotsCache();
    setPicker(null);
    load();
  };

  const assetById = useMemo(() => {
    const m = new Map<string, Asset>();
    for (const a of assets) m.set(a.id, a);
    return m;
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (!search) return assets;
    const q = search.toLowerCase();
    return assets.filter((a) => (a.label ?? "").toLowerCase().includes(q));
  }, [assets, search]);

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl">Libreria foto</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Carica immagini e assegnale agli spazi del sito. Gli spazi senza immagine usano il default.
        </p>
      </div>

      {/* Upload */}
      <div className="bg-background border border-border rounded-xl p-5 mb-8 flex flex-wrap gap-3 items-center">
        <label className={`btn-primary cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "Caricamento…" : "+ Carica immagine"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
        <input
          type="search"
          placeholder="Cerca nella libreria…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <span className="text-xs text-muted-foreground">{assets.length} immagini</span>
      </div>

      {/* Slot groups */}
      {loading ? (
        <p className="text-center text-muted-foreground py-12">Caricamento…</p>
      ) : (
        <div className="space-y-10">
          {SLOT_GROUPS.map((g) => (
            <section key={g.title}>
              <h3 className="font-display text-xl mb-4">{g.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.keys.map((key) => {
                  const assetId = slots[key];
                  const asset = assetId ? assetById.get(assetId) : null;
                  return (
                    <div key={key} className="rounded-xl border border-border bg-background overflow-hidden">
                      <div className="aspect-[16/10] bg-muted overflow-hidden flex items-center justify-center">
                        {asset ? (
                          <img src={asset.public_url} alt={key} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">Default del sito</span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="text-sm font-medium">{MEDIA_SLOTS[key]}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setPicker(key)}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90"
                          >
                            {asset ? "Cambia" : "Scegli"}
                          </button>
                          {asset && (
                            <button
                              onClick={() => assignSlot(key, null)}
                              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                            >
                              Ripristina default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Library */}
          <section>
            <h3 className="font-display text-xl mb-4">Libreria ({filteredAssets.length})</h3>
            {filteredAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-background border border-dashed border-border rounded-xl p-8 text-center">
                Nessuna immagine. Carica la prima per iniziare.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredAssets.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img src={a.public_url} alt={a.label ?? ""} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate" title={a.label ?? ""}>{a.label || "—"}</p>
                      <button
                        onClick={() => removeAsset(a)}
                        className="text-xs text-destructive mt-1 hover:underline"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Picker modal */}
      {picker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPicker(null)}>
          <div className="bg-background rounded-2xl border border-border w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{picker}</p>
                <h3 className="font-display text-lg">{MEDIA_SLOTS[picker]}</h3>
              </div>
              <button onClick={() => setPicker(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="p-5 overflow-y-auto">
              {assets.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Carica prima una immagine nella libreria.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {assets.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => assignSlot(picker, a.id)}
                      className="group rounded-lg overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/30 transition text-left"
                    >
                      <div className="aspect-square bg-muted">
                        <img src={a.public_url} alt={a.label ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">{a.label || "—"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/hero")({
  component: AdminHero,
});

type HeroRow = {
  id: string;
  city: "milano" | "bologna" | "napoli" | "sicilia" | "national";
  storage_path: string;
  public_url: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
};

function AdminHero() {
  const [items, setItems] = useState<HeroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCity, setUploadCity] = useState<"milano" | "bologna">("milano");
  const [uploadLabel, setUploadLabel] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .in("city", ["milano", "bologna"])
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    setItems((data as HeroRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${uploadCity}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("hero-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("hero-images").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("hero_images").insert({
        city: uploadCity,
        storage_path: path,
        public_url: pub.publicUrl,
        label: uploadLabel || null,
        is_active: false,
      });
      if (dbErr) throw dbErr;
      setUploadLabel("");
      load();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (row: HeroRow) => {
    // Unset other active for same city, then set this one
    const { error: e1 } = await supabase
      .from("hero_images")
      .update({ is_active: false })
      .eq("city", row.city)
      .eq("is_active", true);
    if (e1) { alert(e1.message); return; }
    const { error: e2 } = await supabase
      .from("hero_images")
      .update({ is_active: true })
      .eq("id", row.id);
    if (e2) { alert(e2.message); return; }
    load();
  };

  const remove = async (row: HeroRow) => {
    if (!confirm("Eliminare questa immagine?")) return;
    await supabase.storage.from("hero-images").remove([row.storage_path]);
    const { error } = await supabase.from("hero_images").delete().eq("id", row.id);
    if (error) { alert(error.message); return; }
    load();
  };

  const milano = items.filter((i) => i.city === "milano");
  const bologna = items.filter((i) => i.city === "bologna");

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl">Immagini hero</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Carica più foto per ogni città e scegli quella attiva mostrata sul sito.
        </p>
      </div>

      {/* Upload */}
      <div className="bg-background border border-border rounded-xl p-5 mb-8">
        <p className="font-medium mb-3">Carica nuova immagine</p>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Città</span>
            <select
              value={uploadCity}
              onChange={(e) => setUploadCity(e.target.value as typeof uploadCity)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="milano">Milano</option>
              <option value="bologna">Bologna</option>
            </select>
          </label>
          <label className="block flex-1 min-w-[200px]">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Etichetta (opz.)</span>
            <input
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
              placeholder="Es. Inverno 2025"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className={`btn-primary cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? "Caricamento…" : "Scegli file"}
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
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Suggerimento: usa immagini orizzontali ad alta risoluzione (es. 2400×1350).
        </p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Caricamento…</p>
      ) : (
        <div className="space-y-10">
          <CitySection title="Milano" items={milano} onActivate={setActive} onRemove={remove} />
          <CitySection title="Bologna" items={bologna} onActivate={setActive} onRemove={remove} />
        </div>
      )}
    </div>
  );
}

function CitySection({
  title, items, onActivate, onRemove,
}: {
  title: string;
  items: HeroRow[];
  onActivate: (r: HeroRow) => void;
  onRemove: (r: HeroRow) => void;
}) {
  return (
    <section>
      <h3 className="font-display text-2xl mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-background border border-dashed border-border rounded-xl p-8 text-center">
          Nessuna immagine caricata per {title}. Sul sito viene usata l'immagine predefinita.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <div key={r.id} className={`group relative rounded-xl overflow-hidden border ${r.is_active ? "border-primary ring-2 ring-primary/30" : "border-border"} bg-background`}>
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img src={r.public_url} alt={r.label ?? "hero"} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{r.label || "Senza etichetta"}</p>
                  {r.is_active && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Attiva</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  {!r.is_active && (
                    <button onClick={() => onActivate(r)} className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90">
                      Attiva
                    </button>
                  )}
                  <button onClick={() => onRemove(r)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted text-destructive">
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

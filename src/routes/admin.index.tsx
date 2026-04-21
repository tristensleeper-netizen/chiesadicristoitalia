import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  formatItalianDate,
  type Resource,
} from "@/lib/resource-helpers";

export const Route = createFileRoute("/admin/")({
  component: AdminResourcesList,
});

function AdminResourcesList() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) console.error(error);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa risorsa?")) return;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="container-prose py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl">Risorse ({items.length})</h2>
        <Link to="/admin/risorse/$id" params={{ id: "nuovo" }} className="btn-primary">+ Nuova risorsa</Link>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">Nessuna risorsa. Aggiungine una!</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {items.map((r) => (
            <li key={r.id} className="py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    {RESOURCE_TYPE_LABELS[r.type]}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {CITY_TAG_LABELS[r.city_tag]}
                  </span>
                  {!r.published && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Bozza</span>
                  )}
                </div>
                <p className="font-display text-lg truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground">{formatItalianDate(r.published_at)}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/risorse/$id" params={{ id: r.id }} className="text-sm text-primary hover:underline">
                  Modifica
                </Link>
                <button onClick={() => remove(r.id)} className="text-sm text-destructive hover:underline">
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

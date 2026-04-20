import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { formatItalianDate, type Devotional } from "@/lib/resource-helpers";

export const Route = createFileRoute("/admin/devozionali/")({
  component: AdminDevotionalsList,
});

function AdminDevotionalsList() {
  const [items, setItems] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("devotionals")
      .select("*")
      .order("week_of", { ascending: false });
    if (error) console.error(error);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo devozionale?")) return;
    const { error } = await supabase.from("devotionals").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="container-prose py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl">Devozionali ({items.length})</h2>
        <Link to="/admin/devozionali/$id" params={{ id: "nuovo" }} className="btn-primary">
          + Nuovo devozionale
        </Link>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">Nessun devozionale ancora.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {items.map((d) => (
            <li key={d.id} className="py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{d.title}</p>
                <p className="text-xs text-muted-foreground">
                  Settimana del {formatItalianDate(d.week_of)}
                  {d.scripture_ref && ` · ${d.scripture_ref}`}
                  {!d.published && " · Bozza"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/devozionali/$id" params={{ id: d.id }} className="text-sm text-primary hover:underline">
                  Modifica
                </Link>
                <button onClick={() => remove(d.id)} className="text-sm text-destructive hover:underline">
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

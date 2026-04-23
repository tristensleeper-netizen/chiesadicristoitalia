import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { formatItalianDate, type Devotional } from "@/lib/resource-helpers";

export const Route = createFileRoute("/admin/devozionali/")({
  component: AdminDevotionalsList,
});

function AdminDevotionalsList() {
  const [items, setItems] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const togglePublish = async (d: Devotional) => {
    const { error } = await supabase
      .from("devotionals")
      .update({ published: !d.published })
      .eq("id", d.id);
    if (error) { alert(error.message); return; }
    load();
  };

  const filtered = useMemo(() => {
    return items.filter((d) => {
      if (statusFilter === "published" && !d.published) return false;
      if (statusFilter === "draft" && d.published) return false;
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, statusFilter, search]);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((i) => i.published).length,
    drafts: items.filter((i) => !i.published).length,
  }), [items]);

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Devozionali</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Riflessioni settimanali sulla Parola.
          </p>
        </div>
        <Link to="/admin/devozionali/$id" params={{ id: "nuovo" }} className="btn-primary">
          + Nuovo devozionale
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Totale" value={stats.total} />
        <StatCard label="Pubblicati" value={stats.published} accent="text-emerald-600" />
        <StatCard label="Bozze" value={stats.drafts} accent="text-amber-600" />
      </div>

      <div className="bg-background border border-border rounded-xl p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Cerca per titolo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Tutti gli stati</option>
          <option value="published">Pubblicati</option>
          <option value="draft">Bozze</option>
        </select>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-muted-foreground">Caricamento…</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {items.length === 0 ? "Nessun devozionale ancora." : "Nessun risultato."}
            </p>
            {items.length === 0 && (
              <Link to="/admin/devozionali/$id" params={{ id: "nuovo" }} className="btn-primary">
                Scrivi il primo devozionale
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Titolo</th>
                  <th className="text-left px-4 py-3 font-medium">Settimana</th>
                  <th className="text-left px-4 py-3 font-medium">Riferimento</th>
                  <th className="text-left px-4 py-3 font-medium">Stato</th>
                  <th className="text-right px-4 py-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium">{d.title}</p>
                      {d.author && (
                        <p className="text-xs text-muted-foreground mt-0.5">{d.author}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatItalianDate(d.week_of)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {d.scripture_ref ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(d)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                          d.published
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {d.published ? "● Pubblicato" : "○ Bozza"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        to="/admin/devozionali/$id"
                        params={{ id: d.id }}
                        className="text-sm text-primary hover:underline mr-4"
                      >
                        Modifica
                      </Link>
                      <button
                        onClick={() => remove(d.id)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className={`text-2xl font-display mt-1 ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

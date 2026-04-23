import { useEffect, useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const togglePublish = async (r: Resource) => {
    const { error } = await supabase
      .from("resources")
      .update({ published: !r.published })
      .eq("id", r.id);
    if (error) { alert(error.message); return; }
    load();
  };

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (cityFilter !== "all" && r.city_tag !== cityFilter) return false;
      if (statusFilter === "published" && !r.published) return false;
      if (statusFilter === "draft" && r.published) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, typeFilter, cityFilter, statusFilter, search]);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((i) => i.published).length,
    drafts: items.filter((i) => !i.published).length,
    featured: items.filter((i) => i.featured).length,
  }), [items]);

  return (
    <div className="container-prose py-8 md:py-12">
      {/* Page header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Risorse</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sermoni, articoli, video, podcast e PDF.
          </p>
        </div>
        <Link to="/admin/risorse/$id" params={{ id: "nuovo" }} className="btn-primary">
          + Nuova risorsa
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Totale" value={stats.total} />
        <StatCard label="Pubblicate" value={stats.published} accent="text-emerald-600" />
        <StatCard label="Bozze" value={stats.drafts} accent="text-amber-600" />
        <StatCard label="In evidenza" value={stats.featured} accent="text-primary" />
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Cerca per titolo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} label="Tipo">
          <option value="all">Tutti i tipi</option>
          {Object.entries(RESOURCE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={cityFilter} onChange={setCityFilter} label="Città">
          <option value="all">Tutte le città</option>
          {Object.entries(CITY_TAG_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} label="Stato">
          <option value="all">Tutti gli stati</option>
          <option value="published">Pubblicate</option>
          <option value="draft">Bozze</option>
        </FilterSelect>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-muted-foreground">Caricamento…</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {items.length === 0 ? "Nessuna risorsa ancora." : "Nessun risultato per i filtri selezionati."}
            </p>
            {items.length === 0 && (
              <Link to="/admin/risorse/$id" params={{ id: "nuovo" }} className="btn-primary">
                Crea la prima risorsa
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Titolo</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Città</th>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-left px-4 py-3 font-medium">Stato</th>
                  <th className="text-right px-4 py-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{r.title}</span>
                        {r.featured && (
                          <span title="In evidenza" className="text-primary">★</span>
                        )}
                      </div>
                      {r.speaker_or_author && (
                        <p className="text-xs text-muted-foreground mt-0.5">{r.speaker_or_author}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Pill>{RESOURCE_TYPE_LABELS[r.type]}</Pill>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {CITY_TAG_LABELS[r.city_tag]}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatItalianDate(r.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(r)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                          r.published
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {r.published ? "● Pubblicata" : "○ Bozza"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        to="/admin/risorse/$id"
                        params={{ id: r.id }}
                        className="text-sm text-primary hover:underline mr-4"
                      >
                        Modifica
                      </Link>
                      <button
                        onClick={() => remove(r.id)}
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

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          {filtered.length} di {items.length} risorse
        </p>
      )}
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
      {children}
    </span>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {children}
    </select>
  );
}

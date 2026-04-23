import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { CityEventRow } from "@/lib/use-city-events";

export const Route = createFileRoute("/admin/eventi")({
  component: AdminEvents,
});

const EMPTY: Partial<CityEventRow> = {
  city: "milano",
  kind: "recurring",
  title: "",
  blurb: "",
  tag: "",
  day_label: "",
  date_label: "",
  time_label: "",
  event_date: null,
  sort_order: 0,
  active: true,
};

function AdminEvents() {
  const [items, setItems] = useState<CityEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<"all" | "milano" | "bologna">("all");
  const [editing, setEditing] = useState<Partial<CityEventRow> | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("city_events")
      .select("*")
      .in("city", ["milano", "bologna"])
      .order("city", { ascending: true })
      .order("kind", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) console.error(error);
    setItems((data as CityEventRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => items.filter((i) => cityFilter === "all" || i.city === cityFilter),
    [items, cityFilter]
  );

  const save = async () => {
    if (!editing || !editing.title || !editing.city || !editing.kind) {
      alert("Città, tipo e titolo sono obbligatori.");
      return;
    }
    const payload = {
      city: editing.city,
      kind: editing.kind,
      title: editing.title,
      blurb: editing.blurb ?? null,
      tag: editing.tag ?? null,
      day_label: editing.day_label ?? null,
      date_label: editing.date_label ?? null,
      time_label: editing.time_label ?? null,
      event_date: editing.event_date || null,
      sort_order: editing.sort_order ?? 0,
      active: editing.active ?? true,
    };
    const res = editing.id
      ? await supabase.from("city_events").update(payload).eq("id", editing.id)
      : await supabase.from("city_events").insert(payload);
    if (res.error) { alert(res.error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo evento?")) return;
    const { error } = await supabase.from("city_events").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  };

  const toggleActive = async (r: CityEventRow) => {
    const { error } = await supabase
      .from("city_events")
      .update({ active: !r.active })
      .eq("id", r.id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Calendario eventi</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Eventi ricorrenti (settimana tipo) ed eventi speciali per Milano e Bologna.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="btn-primary"
        >
          + Nuovo evento
        </button>
      </div>

      <div className="bg-background border border-border rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
        <select
          aria-label="Città"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value as typeof cityFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Tutte le città</option>
          <option value="milano">Milano</option>
          <option value="bologna">Bologna</option>
        </select>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-muted-foreground">Caricamento…</p>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">
            Nessun evento. Crea il primo per iniziare.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Città</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Titolo</th>
                  <th className="text-left px-4 py-3 font-medium">Quando</th>
                  <th className="text-left px-4 py-3 font-medium">Ord.</th>
                  <th className="text-left px-4 py-3 font-medium">Stato</th>
                  <th className="text-right px-4 py-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 capitalize">{r.city}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.kind === "recurring" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {r.kind === "recurring" ? "Ricorrente" : "Speciale"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.title}</p>
                      {r.tag && <p className="text-xs text-muted-foreground mt-0.5">{r.tag}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {[r.day_label, r.date_label].filter(Boolean).join(" ")}
                      {r.time_label ? ` · ${r.time_label}` : ""}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(r)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          r.active
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {r.active ? "● Attivo" : "○ Nascosto"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditing(r)}
                        className="text-sm text-primary hover:underline mr-4"
                      >
                        Modifica
                      </button>
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

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-display text-xl">{editing.id ? "Modifica evento" : "Nuovo evento"}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Città">
                  <select
                    value={editing.city}
                    onChange={(e) => setEditing({ ...editing, city: e.target.value as CityEventRow["city"] })}
                    className="input"
                  >
                    <option value="milano">Milano</option>
                    <option value="bologna">Bologna</option>
                  </select>
                </Field>
                <Field label="Tipo">
                  <select
                    value={editing.kind}
                    onChange={(e) => setEditing({ ...editing, kind: e.target.value as CityEventRow["kind"] })}
                    className="input"
                  >
                    <option value="recurring">Ricorrente (settimana tipo)</option>
                    <option value="special">Speciale (data una tantum)</option>
                  </select>
                </Field>
              </div>
              <Field label="Titolo">
                <input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="input"
                  placeholder="Es. Funzione domenicale"
                />
              </Field>
              <Field label="Descrizione breve">
                <textarea
                  value={editing.blurb ?? ""}
                  onChange={(e) => setEditing({ ...editing, blurb: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="Una frase invitante"
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Giorno (es. Dom)">
                  <input
                    value={editing.day_label ?? ""}
                    onChange={(e) => setEditing({ ...editing, day_label: e.target.value })}
                    className="input"
                    placeholder="Dom"
                  />
                </Field>
                <Field label="Data (es. 27)">
                  <input
                    value={editing.date_label ?? ""}
                    onChange={(e) => setEditing({ ...editing, date_label: e.target.value })}
                    className="input"
                    placeholder="27"
                  />
                </Field>
                <Field label="Orario">
                  <input
                    value={editing.time_label ?? ""}
                    onChange={(e) => setEditing({ ...editing, time_label: e.target.value })}
                    className="input"
                    placeholder="10:30"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Etichetta (es. Settimanale)">
                  <input
                    value={editing.tag ?? ""}
                    onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Ordinamento">
                  <input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
              </div>
              {editing.kind === "special" && (
                <Field label="Data calendario (opzionale, per ordinamento)">
                  <input
                    type="date"
                    value={editing.event_date ?? ""}
                    onChange={(e) => setEditing({ ...editing, event_date: e.target.value })}
                    className="input"
                  />
                </Field>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                <span className="text-sm">Visibile sul sito</span>
              </label>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="btn-outline">Annulla</button>
              <button onClick={save} className="btn-primary">Salva</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input { width: 100%; border-radius: 0.5rem; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); padding: 0.5rem 0.75rem; font-size: 0.875rem; }
        .input:focus { outline: none; box-shadow: 0 0 0 2px hsl(var(--primary) / 0.3); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { CityEventRow } from "@/lib/use-city-events";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const Route = createFileRoute("/admin/eventi")({
  component: AdminEvents,
});

const WEEKDAYS = [
  { v: 0, label: "Domenica" },
  { v: 1, label: "Lunedì" },
  { v: 2, label: "Martedì" },
  { v: 3, label: "Mercoledì" },
  { v: 4, label: "Giovedì" },
  { v: 5, label: "Venerdì" },
  { v: 6, label: "Sabato" },
];

type EditState = Partial<CityEventRow> & {
  // Local-form helpers (separate date + time inputs)
  _start_date?: string;
  _start_time?: string;
  _end_time?: string;
};

const EMPTY: EditState = {
  city: "milano",
  kind: "special",
  title: "",
  blurb: "",
  tag: "",
  recurrence: "none",
  weekday: null,
  recurrence_end: null,
  location: "",
  sort_order: 0,
  active: true,
  _start_date: "",
  _start_time: "",
  _end_time: "",
};

function toLocalParts(iso: string | null | undefined) {
  if (!iso) return { d: "", t: "" };
  const dt = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    d: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`,
    t: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
  };
}

function combineDateTime(date: string, time: string): string | null {
  if (!date) return null;
  const t = time || "00:00";
  // Build a local date and let JS produce ISO string
  const dt = new Date(`${date}T${t}:00`);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function rowToEdit(r: CityEventRow): EditState {
  const start = toLocalParts(r.start_at);
  const end = toLocalParts(r.end_at);
  return {
    ...r,
    _start_date: start.d,
    _start_time: start.t,
    _end_time: end.t,
  };
}

function AdminEvents() {
  const [items, setItems] = useState<CityEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<"all" | "milano" | "bologna">("all");
  const [editing, setEditing] = useState<EditState | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("city_events")
      .select("*")
      .in("city", ["milano", "bologna"])
      .order("city", { ascending: true })
      .order("recurrence", { ascending: false })
      .order("start_at", { ascending: true, nullsFirst: false });
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
    if (!editing || !editing.title || !editing.city) {
      alert("Città e titolo sono obbligatori.");
      return;
    }
    const isWeekly = editing.recurrence === "weekly";
    if (!isWeekly && !editing._start_date) {
      alert("Indica la data dell'evento.");
      return;
    }
    if (isWeekly && (editing.weekday === null || editing.weekday === undefined)) {
      alert("Scegli il giorno della settimana per gli eventi ricorrenti.");
      return;
    }

    const start = combineDateTime(editing._start_date || "", editing._start_time || "");
    const end =
      editing._start_date && editing._end_time
        ? combineDateTime(editing._start_date, editing._end_time)
        : null;

    const payload = {
      city: editing.city,
      kind: isWeekly ? "recurring" : "special",
      title: editing.title,
      blurb: editing.blurb ?? null,
      tag: editing.tag ?? null,
      location: editing.location ?? null,
      recurrence: editing.recurrence ?? "none",
      weekday: isWeekly ? editing.weekday ?? null : null,
      recurrence_end: isWeekly ? editing.recurrence_end || null : null,
      start_at: start,
      end_at: end,
      // Keep legacy fields in sync for older code paths
      day_label: null,
      date_label: null,
      time_label: null,
      event_date: !isWeekly && editing._start_date ? editing._start_date : null,
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

  const formatWhen = (r: CityEventRow): string => {
    if (r.recurrence === "weekly" && r.weekday !== null) {
      const wd = WEEKDAYS.find((w) => w.v === r.weekday)?.label ?? "";
      const time = r.start_at ? format(new Date(r.start_at), "HH:mm") : "";
      return `Ogni ${wd}${time ? ` · ${time}` : ""}`;
    }
    if (r.start_at) {
      return format(new Date(r.start_at), "EEE d LLL yyyy · HH:mm", { locale: it });
    }
    // Legacy fallback
    return [r.day_label, r.date_label].filter(Boolean).join(" ") + (r.time_label ? ` · ${r.time_label}` : "");
  };

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Calendario eventi</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Eventi singoli (con data) o ricorrenti settimanali per Milano e Bologna.
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
                  <th className="text-left px-4 py-3 font-medium">Stato</th>
                  <th className="text-right px-4 py-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 capitalize">{r.city}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.recurrence === "weekly" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {r.recurrence === "weekly" ? "Settimanale" : "Singolo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.title}</p>
                      {r.tag && <p className="text-xs text-muted-foreground mt-0.5">{r.tag}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatWhen(r)}
                    </td>
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
                        onClick={() => setEditing(rowToEdit(r))}
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
                <Field label="Frequenza">
                  <select
                    value={editing.recurrence ?? "none"}
                    onChange={(e) => setEditing({ ...editing, recurrence: e.target.value as "none" | "weekly" })}
                    className="input"
                  >
                    <option value="none">Singolo (data fissa)</option>
                    <option value="weekly">Settimanale</option>
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

              {editing.recurrence === "weekly" ? (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Giorno della settimana">
                    <select
                      value={editing.weekday ?? ""}
                      onChange={(e) => setEditing({ ...editing, weekday: e.target.value === "" ? null : Number(e.target.value) })}
                      className="input"
                    >
                      <option value="">— Scegli —</option>
                      {WEEKDAYS.map((w) => (
                        <option key={w.v} value={w.v}>{w.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="A partire dal">
                    <input
                      type="date"
                      value={editing._start_date ?? ""}
                      onChange={(e) => setEditing({ ...editing, _start_date: e.target.value })}
                      className="input"
                    />
                  </Field>
                </div>
              ) : (
                <Field label="Data">
                  <input
                    type="date"
                    value={editing._start_date ?? ""}
                    onChange={(e) => setEditing({ ...editing, _start_date: e.target.value })}
                    className="input"
                  />
                </Field>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Ora inizio">
                  <input
                    type="time"
                    value={editing._start_time ?? ""}
                    onChange={(e) => setEditing({ ...editing, _start_time: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Ora fine (opzionale)">
                  <input
                    type="time"
                    value={editing._end_time ?? ""}
                    onChange={(e) => setEditing({ ...editing, _end_time: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              {editing.recurrence === "weekly" && (
                <Field label="Termina il (opzionale)">
                  <input
                    type="date"
                    value={editing.recurrence_end ?? ""}
                    onChange={(e) => setEditing({ ...editing, recurrence_end: e.target.value || null })}
                    className="input"
                  />
                </Field>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Luogo (opzionale)">
                  <input
                    value={editing.location ?? ""}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    className="input"
                    placeholder="Es. Sala principale"
                  />
                </Field>
                <Field label="Etichetta (opzionale)">
                  <input
                    value={editing.tag ?? ""}
                    onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    className="input"
                    placeholder="Es. Speciale"
                  />
                </Field>
              </div>

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

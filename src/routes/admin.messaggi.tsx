import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messaggi")({
  component: AdminMessages,
});

type Submission = {
  id: string;
  city: string;
  name: string;
  email: string;
  interest: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

function AdminMessages() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "handled">("new");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    setItems((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleHandled = async (s: Submission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ handled: !s.handled })
      .eq("id", s.id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo messaggio?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  };

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "new") return items.filter((i) => !i.handled);
    return items.filter((i) => i.handled);
  }, [items, filter]);

  const stats = useMemo(
    () => ({
      total: items.length,
      newCount: items.filter((i) => !i.handled).length,
      handled: items.filter((i) => i.handled).length,
    }),
    [items],
  );

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Messaggi dal sito</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tutti i messaggi inviati dai moduli di contatto.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Totale" value={stats.total} />
        <StatCard label="Nuovi" value={stats.newCount} accent="text-amber-600" />
        <StatCard label="Gestiti" value={stats.handled} accent="text-emerald-600" />
      </div>

      <div className="bg-background border border-border rounded-xl p-4 mb-4 flex gap-2">
        {(["new", "all", "handled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            {f === "new" ? "Nuovi" : f === "all" ? "Tutti" : "Gestiti"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="p-12 text-center text-muted-foreground">Caricamento…</p>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground bg-background border border-border rounded-xl">
            Nessun messaggio.
          </p>
        ) : (
          filtered.map((s) => (
            <article
              key={s.id}
              className={`bg-background border rounded-xl p-5 ${
                s.handled ? "border-border opacity-70" : "border-primary/30"
              }`}
            >
              <header className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <a
                    href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.interest ?? "Il tuo messaggio")}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {s.email}
                  </a>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="uppercase tracking-wider">{s.city}</p>
                  <p>{new Date(s.created_at).toLocaleString("it-IT")}</p>
                </div>
              </header>
              {s.interest && (
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Interesse: <span className="text-foreground/80">{s.interest}</span>
                </p>
              )}
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{s.message}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => toggleHandled(s)}
                  className="text-sm rounded-full border border-border px-3 py-1.5 hover:bg-muted transition"
                >
                  {s.handled ? "Segna come nuovo" : "Segna come gestito"}
                </button>
                <button
                  onClick={() => remove(s.id)}
                  className="text-sm text-destructive hover:underline"
                >
                  Elimina
                </button>
              </div>
            </article>
          ))
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

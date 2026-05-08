import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  type CityTag,
  type Resource,
} from "@/lib/resource-helpers";
import { PageHero } from "@/components/page-hero";
import { ResourceCard } from "@/routes/risorse.index";
import bibleStudy from "@/assets/bible-study.jpg";

export const Route = createFileRoute("/sermoni/")({
  head: () => ({
    meta: [
      { title: "Sermoni cristiani in italiano — Chiesa di Cristo Italia" },
      {
        name: "description",
        content:
          "Sermoni cristiani in italiano: prediche bibliche dalle Chiese di Cristo di Milano e Bologna. Ascolta i nostri sermoni settimanali, audio e video.",
      },
      { property: "og:title", content: "Sermoni cristiani in italiano — Chiesa di Cristo Italia" },
      {
        property: "og:description",
        content:
          "Prediche bibliche dalle Chiese di Cristo di Milano e Bologna. Ascolta i nostri sermoni audio e video ogni settimana.",
      },
      { property: "og:image", content: bibleStudy },
    ],
  }),
  component: SermoniIndex,
});

const CITY_FILTERS: Array<{ value: CityTag | "all"; label: string }> = [
  { value: "all", label: "Tutte le città" },
  { value: "milano", label: "Milano" },
  { value: "bologna", label: "Bologna" },
  { value: "napoli", label: "Napoli" },
  { value: "sicilia", label: "Palermo" },
  { value: "national", label: "Nazionale" },
];

type SortOrder = "newest" | "oldest";

function SermoniIndex() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<CityTag | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("published", true)
        .eq("type", "sermon")
        .order("published_at", { ascending: false });
      if (!active) return;
      if (error) console.error(error);
      setResources(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = resources.filter(
      (r) => cityFilter === "all" || r.city_tag === cityFilter,
    );
    return [...list].sort((a, b) => {
      const ta = new Date(a.published_at).getTime();
      const tb = new Date(b.published_at).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [resources, cityFilter, sortOrder]);

  return (
    <>
      <PageHero
        image={bibleStudy}
        eyebrow="Sermoni"
        title={<>Sermoni e<br />prediche bibliche.</>}
        subtitle="Prediche bibliche dalle Chiese di Cristo di Milano e Bologna. Ascolta i nostri sermoni settimanali, in audio e video."
        height="medium"
      />

      <section className="container-prose py-16 md:py-20">
        <div className="mb-12 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Sermoni e prediche bibliche delle nostre comunità
          </h2>
          <p className="text-foreground/75 leading-relaxed">
            Ogni domenica nelle nostre chiese di Milano e Bologna vengono predicati
            sermoni basati sulla Bibbia, pensati per parlare alla vita di tutti i giorni
            e per aiutarci a seguire Gesù da vicino. Trovi qui l'archivio completo dei
            sermoni: filtra per città o ordina per data per ascoltare le predicazioni
            più recenti. Se cerchi articoli, video di approfondimento o altre risorse,
            visita la pagina <a href="/risorse" className="text-primary underline-offset-4 hover:underline">Risorse</a>.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-12" aria-label="Filtri sermoni">
          <div>
            <p className="eyebrow mb-3">Filtra per città</p>
            <div className="flex flex-wrap gap-2">
              {CITY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCityFilter(f.value)}
                  className={
                    "rounded-full px-4 py-2 text-sm transition-all " +
                    (cityFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground/70 hover:border-primary hover:text-primary")
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3">Ordina per data</p>
            <div className="flex flex-wrap gap-2">
              {(["newest", "oldest"] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setSortOrder(o)}
                  className={
                    "rounded-full px-4 py-2 text-sm transition-all " +
                    (sortOrder === o
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground/70 hover:border-primary hover:text-primary")
                  }
                >
                  {o === "newest" ? "Più recenti" : "Meno recenti"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-muted-foreground">Caricamento sermoni…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            Nessun sermone trovato con questi filtri.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

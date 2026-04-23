import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { formatItalianDate, type Devotional } from "@/lib/resource-helpers";
import { PageHero } from "@/components/page-hero";
import { useSlotImage } from "@/lib/use-slot-image";
import worship from "@/assets/worship.jpg";

export const Route = createFileRoute("/devozionale/")({
  head: () => ({
    meta: [
      { title: "Devozionale settimanale — Chiesa di Cristo Italia" },
      {
        name: "description",
        content:
          "Una breve riflessione settimanale sulle Scritture, per accompagnare la tua settimana con la Parola.",
      },
      { property: "og:title", content: "Devozionale settimanale" },
      { property: "og:image", content: worship },
    ],
  }),
  component: DevotionalIndex,
});

function DevotionalIndex() {
  const [items, setItems] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .eq("published", true)
        .order("week_of", { ascending: false });
      if (!active) return;
      if (error) console.error(error);
      setItems(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const current = items[0];
  const archive = items.slice(1);

  return (
    <>
      <PageHero
        image={worship}
        eyebrow="Devozionale"
        title={<>Una Parola<br />per la settimana.</>}
        subtitle="Ogni settimana, una breve riflessione dalle Scritture per nutrire la tua fede ovunque tu sia."
        height="medium"
      />

      <section className="container-narrow py-20">
        {loading ? (
          <p className="text-center text-muted-foreground">Caricamento…</p>
        ) : !current ? (
          <p className="text-center text-muted-foreground">
            Il primo devozionale arriverà presto.
          </p>
        ) : (
          <article>
            <p className="eyebrow mb-4">Settimana del {formatItalianDate(current.week_of)}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
              {current.title}
            </h2>
            {current.scripture_ref && (
              <p className="mt-4 font-display italic text-xl text-primary">
                {current.scripture_ref}
              </p>
            )}
            <div className="mt-8 text-foreground/85 leading-relaxed text-lg whitespace-pre-line">
              {current.body}
            </div>
            {current.author && (
              <p className="mt-8 text-sm text-muted-foreground">— {current.author}</p>
            )}
          </article>
        )}

        {archive.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <p className="eyebrow mb-6">Archivio</p>
            <ul className="divide-y divide-border">
              {archive.map((d) => (
                <li key={d.id} className="py-5 flex justify-between items-baseline gap-4">
                  <div>
                    <p className="font-display text-xl text-foreground">{d.title}</p>
                    {d.scripture_ref && (
                      <p className="text-sm text-muted-foreground">{d.scripture_ref}</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatItalianDate(d.week_of)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link to="/risorse" className="btn-outline">
            Esplora tutte le risorse
          </Link>
        </div>
      </section>
    </>
  );
}

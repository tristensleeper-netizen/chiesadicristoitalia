import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ResourceCard } from "@/routes/risorse.index";
import { formatItalianDate, type CityTag, type Devotional, type Resource } from "@/lib/resource-helpers";

export function CityLatest({ cityTag, cityName }: { cityTag: CityTag; cityName: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const [resRes, devRes] = await Promise.all([
        supabase
          .from("resources")
          .select("*")
          .eq("published", true)
          .in("city_tag", [cityTag, "national"])
          .order("published_at", { ascending: false })
          .limit(3),
        supabase
          .from("devotionals")
          .select("*")
          .eq("published", true)
          .order("week_of", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      if (!active) return;
      setResources(resRes.data ?? []);
      setDevotional(devRes.data ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [cityTag]);

  if (loading) return null;
  if (resources.length === 0 && !devotional) return null;

  return (
    <>
      {devotional && (
        <section className="bg-primary-soft">
          <div className="container-narrow py-20">
            <p className="eyebrow mb-4">Devozionale della settimana</p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              {devotional.title}
            </h2>
            {devotional.scripture_ref && (
              <p className="mt-3 font-display italic text-lg text-primary">
                {devotional.scripture_ref}
              </p>
            )}
            <p className="mt-6 text-foreground/80 leading-relaxed line-clamp-4 whitespace-pre-line">
              {devotional.body}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link to="/devozionale/$slug" params={{ slug: devotional.slug }} className="btn-primary">
                Leggi tutto
              </Link>
              <span className="text-xs text-muted-foreground">
                Settimana del {formatItalianDate(devotional.week_of)}
              </span>
            </div>
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section className="container-prose py-20">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <p className="eyebrow mb-3">Ultime risorse</p>
              <h2 className="font-display text-3xl md:text-4xl">
                Cosa sta succedendo a {cityName}.
              </h2>
            </div>
            <Link to="/risorse" className="text-sm font-medium text-primary hover:underline">
              Tutte le risorse →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

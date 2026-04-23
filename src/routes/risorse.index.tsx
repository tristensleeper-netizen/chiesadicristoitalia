import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  fetchOEmbedThumbnail,
  formatItalianDate,
  getInstantThumbnail,
  type CityTag,
  type Resource,
  type ResourceType,
} from "@/lib/resource-helpers";
import { PageHero } from "@/components/page-hero";
import bibleStudy from "@/assets/bible-study.jpg";

export const Route = createFileRoute("/risorse/")({
  head: () => ({
    meta: [
      { title: "Risorse — Sermoni, articoli e video | Chiesa di Cristo Italia" },
      {
        name: "description",
        content:
          "Esplora la nostra biblioteca di sermoni, articoli, video e podcast dalle Chiese di Cristo di Milano, Bologna, Napoli e Sicilia.",
      },
      { property: "og:title", content: "Risorse — Chiesa di Cristo in Italia" },
      {
        property: "og:description",
        content: "Sermoni, articoli, video e podcast per crescere nella fede.",
      },
      { property: "og:image", content: bibleStudy },
    ],
  }),
  component: ResourcesIndex,
});

const TYPE_FILTERS: Array<{ value: ResourceType | "all"; label: string }> = [
  { value: "all", label: "Tutti" },
  { value: "sermon", label: "Sermoni" },
  { value: "article", label: "Articoli" },
  { value: "video", label: "Video" },
  { value: "podcast", label: "Podcast" },
  { value: "pdf", label: "PDF" },
];

const CITY_FILTERS: Array<{ value: CityTag | "all"; label: string }> = [
  { value: "all", label: "Tutte le città" },
  { value: "milano", label: "Milano" },
  { value: "bologna", label: "Bologna" },
  { value: "napoli", label: "Napoli" },
  { value: "sicilia", label: "Sicilia" },
  { value: "national", label: "Nazionale" },
];

type SortOrder = "newest" | "oldest";

function ResourcesIndex() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [cityFilter, setCityFilter] = useState<CityTag | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("published", true)
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
      (r) =>
        (typeFilter === "all" || r.type === typeFilter) &&
        (cityFilter === "all" || r.city_tag === cityFilter),
    );
    return [...list].sort((a, b) => {
      const ta = new Date(a.published_at).getTime();
      const tb = new Date(b.published_at).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [resources, typeFilter, cityFilter, sortOrder]);

  return (
    <>
      <PageHero
        image={bibleStudy}
        eyebrow="Risorse"
        title={<>Esplora. Ascolta.<br />Cresci.</>}
        subtitle="Una biblioteca viva di sermoni, articoli, video e podcast dalla nostra famiglia di chiese in Italia."
        height="medium"
      />

      <section className="container-prose py-16 md:py-20">
        <div className="flex flex-col gap-6 mb-12">
          <div>
            <p className="eyebrow mb-3">Filtra per tipo</p>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={
                    "rounded-full px-4 py-2 text-sm transition-all " +
                    (typeFilter === f.value
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
        </div>

        {loading ? (
          <p className="text-center py-20 text-muted-foreground">Caricamento risorse…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            Nessuna risorsa trovata con questi filtri.
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

export function ResourceCard({ r }: { r: Resource }) {
  const isPlayable = r.type === "video" || r.type === "sermon" || r.type === "podcast";
  return (
    <Link
      to="/risorse/$slug"
      params={{ slug: r.slug }}
      className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
    >
      <ResourceCardPreview r={r} showPlay={isPlayable} />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
            {RESOURCE_TYPE_LABELS[r.type]}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {CITY_TAG_LABELS[r.city_tag]}
          </span>
        </div>
        <h3 className="font-display text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
          {r.title}
        </h3>
        {r.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          {formatItalianDate(r.published_at)}
          {r.speaker_or_author && ` · ${r.speaker_or_author}`}
        </p>
      </div>
    </Link>
  );
}

function ResourceCardPreview({ r, showPlay }: { r: Resource; showPlay: boolean }) {
  const instant = r.thumbnail_url ?? getInstantThumbnail(r.media_url);
  const [thumb, setThumb] = useState<string | null>(instant);

  useEffect(() => {
    if (thumb || !r.media_url) return;
    let active = true;
    fetchOEmbedThumbnail(r.media_url).then((t) => {
      if (active && t) setThumb(t);
    });
    return () => {
      active = false;
    };
  }, [r.media_url, thumb]);

  if (thumb) {
    return (
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {showPlay && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-lg transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
      <span className="font-display text-5xl text-primary/40">
        {r.type === "sermon" ? "✝" : r.type === "video" ? "▶" : r.type === "podcast" ? "♪" : r.type === "pdf" ? "↓" : "✎"}
      </span>
    </div>
  );
}

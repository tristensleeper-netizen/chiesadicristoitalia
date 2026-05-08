import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  formatItalianDate,
  type CityTag,
  type Devotional,
  type Resource,
  type ResourceType,
} from "@/lib/resource-helpers";
import { PageHero } from "@/components/page-hero";
import { useSlotImage } from "@/lib/use-slot-image";
import bibleStudy from "@/assets/bible-study.jpg";

export const Route = createFileRoute("/risorse/")({
  head: () => ({
    meta: [
      { title: "Risorse cristiane — Articoli, video e studi biblici | Chiesa di Cristo Italia" },
      {
        name: "description",
        content:
          "Articoli, video e studi biblici dalle Chiese di Cristo di Milano e Bologna. Risorse cristiane per crescere nella fede e nella conoscenza della Bibbia.",
      },
      { property: "og:title", content: "Risorse cristiane — Articoli, video e studi biblici" },
      {
        property: "og:description",
        content: "Articoli, video e studi biblici dalle Chiese di Cristo di Milano e Bologna.",
      },
      { property: "og:image", content: bibleStudy },
    ],
  }),
  component: ResourcesIndex,
});

type FilterType = ResourceType | "devotional" | "all";

const TYPE_FILTERS: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "Tutti" },
  { value: "article", label: "Articoli" },
  { value: "video", label: "Video" },
  { value: "devotional", label: "Devozionali" },
  { value: "pdf", label: "PDF" },
];

const CITY_FILTERS: Array<{ value: CityTag | "all"; label: string }> = [
  { value: "all", label: "Tutte le città" },
  { value: "milano", label: "Milano" },
  { value: "bologna", label: "Bologna" },
  { value: "napoli", label: "Napoli" },
  { value: "sicilia", label: "Palermo" },
  { value: "national", label: "Nazionale" },
];

type SortOrder = "newest" | "oldest";

type ListItem =
  | { kind: "resource"; r: Resource; sortDate: string }
  | { kind: "devotional"; d: Devotional; sortDate: string };

function ResourcesIndex() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [cityFilter, setCityFilter] = useState<CityTag | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let active = true;
    (async () => {
      const [resRes, devRes] = await Promise.all([
        supabase
          .from("resources")
          .select("*")
          .eq("published", true)
          .neq("type", "sermon")
          .order("published_at", { ascending: false }),
        supabase
          .from("devotionals")
          .select("*")
          .eq("published", true)
          .order("week_of", { ascending: false }),
      ]);
      if (!active) return;
      if (resRes.error) console.error(resRes.error);
      if (devRes.error) console.error(devRes.error);
      setResources(resRes.data ?? []);
      setDevotionals(devRes.data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    if (typeFilter === "all" || typeFilter === "devotional") {
      // devotionals are not city-scoped — only show when city filter is "all" or "national"
      if (cityFilter === "all" || cityFilter === "national") {
        for (const d of devotionals) {
          items.push({ kind: "devotional", d, sortDate: d.week_of });
        }
      }
    }
    if (typeFilter !== "devotional") {
      for (const r of resources) {
        if (typeFilter !== "all" && r.type !== typeFilter) continue;
        if (cityFilter !== "all" && r.city_tag !== cityFilter) continue;
        items.push({ kind: "resource", r, sortDate: r.published_at });
      }
    }
    return items.sort((a, b) => {
      const ta = new Date(a.sortDate).getTime();
      const tb = new Date(b.sortDate).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [resources, devotionals, typeFilter, cityFilter, sortOrder]);

  const heroImg = useSlotImage("risorse.hero", bibleStudy);

  return (
    <>
      <PageHero
        slot="risorse.hero"
        image={heroImg}
        eyebrow="Risorse"
        title={<>Articoli, video<br />e studi biblici.</>}
        subtitle="Risorse cristiane dalle Chiese di Cristo di Milano e Bologna per crescere nella fede e nella conoscenza della Bibbia."
        height="medium"
      />

      <section className="container-prose py-16 md:py-20">
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
          <p className="text-sm md:text-base text-foreground/80">
            <span className="font-medium text-primary">Cerchi i sermoni?</span>{" "}
            Trovi tutte le prediche bibliche delle nostre comunità nella sezione dedicata{" "}
            <Link to="/sermoni" className="text-primary underline-offset-4 underline hover:opacity-80">
              Sermoni →
            </Link>
          </p>
        </div>

        <div className="mb-12 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Articoli, video e risorse cristiane
          </h2>
          <p className="text-foreground/75 leading-relaxed">
            Una raccolta di articoli, video e materiali di studio prodotti dalle nostre
            comunità. Trovi approfondimenti biblici, riflessioni sulla vita cristiana,
            video di insegnamento e PDF scaricabili. Filtra per tipo di contenuto o
            per città per scoprire ciò che ti interessa di più.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-12" aria-label="Filtri risorse">

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
          <p className="text-center py-20 text-muted-foreground">Caricamento risorse…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            Nessuna risorsa trovata con questi filtri.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) =>
              item.kind === "resource" ? (
                <ResourceCard key={`r-${item.r.id}`} r={item.r} />
              ) : (
                <DevotionalCard key={`d-${item.d.id}`} d={item.d} />
              ),
            )}
          </div>
        )}
      </section>
    </>
  );
}

export function ResourceCard({ r }: { r: Resource }) {
  const isPlayable = r.type === "video" || r.type === "sermon";
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

// Rich, varied gradient palettes inspired by the original video thumbnails
const GRADIENT_PALETTES = [
  "bg-[linear-gradient(135deg,#1e2a3a_0%,#2a3a4f_50%,#3a4a60_100%)]", // deep navy
  "bg-[linear-gradient(135deg,#3d2817_0%,#5a3a1f_50%,#7a4f2a_100%)]", // warm brown
  "bg-[linear-gradient(135deg,#1a2e1f_0%,#234030_50%,#2f5540_100%)]", // forest green
  "bg-[linear-gradient(135deg,#2a1e2e_0%,#3f2a45_50%,#553a5c_100%)]", // plum
  "bg-[linear-gradient(135deg,#2e2418_0%,#453620_50%,#5e4a2e_100%)]", // bronze
  "bg-[linear-gradient(135deg,#1a2a3d_0%,#1f3a55_50%,#2a4a6e_100%)]", // ocean blue
];

function hashToIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

function ResourceCardPreview({ r, showPlay }: { r: Resource; showPlay: boolean }) {
  const palette = GRADIENT_PALETTES[hashToIndex(r.id ?? r.slug ?? r.title, GRADIENT_PALETTES.length)];
  return (
    <div className={`relative aspect-video ${palette}`}>
      {showPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-lg transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function DevotionalCard({ d }: { d: Devotional }) {
  return (
    <Link
      to="/devozionale/$slug"
      params={{ slug: d.slug }}
      className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-video bg-[linear-gradient(135deg,#1f3a55_0%,#2a4a6e_50%,#3a5f8a_100%)] flex items-center justify-center">
        <div className="text-center text-white/90 px-6">
          {d.scripture_ref && (
            <p className="font-display italic text-base md:text-lg">
              {d.scripture_ref}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
            Devozionale
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Settimanale
          </span>
        </div>
        <h3 className="font-display text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
          {d.title}
        </h3>
        {d.body && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
            {d.body}
          </p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Settimana del {formatItalianDate(d.week_of)}
          {d.author && ` · ${d.author}`}
        </p>
      </div>
    </Link>
  );
}

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
  getYouTubeId,
} from "@/lib/resource-helpers";
import bibleStudy from "@/assets/bible-study.jpg";
import { useCourseProgress } from "@/components/course-shell";

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
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/risorse" }],
  }),
  component: ResourcesIndex,
});

type FilterType = ResourceType | "devotional" | "all";

const TYPE_FILTERS: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "Tutto" },
  { value: "article", label: "Articoli" },
  { value: "devotional", label: "Devozionali" },
  { value: "pdf", label: "PDF" },
];

const CITY_FILTERS: Array<{ value: CityTag | "all"; label: string }> = [
  { value: "all", label: "Tutte le città" },
  { value: "milano", label: "Milano" },
  { value: "bologna", label: "Bologna" },
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
          .not("type", "in", "(sermon,video)")
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

  const noFilters = typeFilter === "all" && cityFilter === "all";
  const devotionalScope = cityFilter === "all" || cityFilter === "national";
  const showIsaiahInDevotionals = typeFilter === "devotional" && devotionalScope;
  const gridItems = filtered.filter((i): i is Extract<ListItem, { kind: "resource" }> => i.kind === "resource");
  const devItems = filtered.filter((i): i is Extract<ListItem, { kind: "devotional" }> => i.kind === "devotional");
  const nothing = gridItems.length === 0 && devItems.length === 0 && !noFilters && !showIsaiahInDevotionals;

  const chipBase =
    "inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-9";
  const selectBase =
    "min-h-11 md:min-h-9 rounded-full border border-border bg-background px-4 pr-8 text-sm text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <>
      <header className="container-prose pt-12 pb-8 md:pt-20 md:pb-10">
        <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none">Risorse</h1>
        <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
          <p className="text-base md:text-lg text-foreground/75">
            Articoli, studi biblici e materiali per crescere nella fede e nella conoscenza della Bibbia.
          </p>
          <p className="shrink-0 text-sm text-foreground/70">
            <span className="font-medium text-primary">Cerchi i sermoni?</span>{" "}
            <Link to="/sermoni" className="text-primary underline underline-offset-4 hover:opacity-80">
              Sermoni →
            </Link>
          </p>
        </div>
      </header>

      <section className="container-prose pb-16 md:pb-20">
        <div
          className="mb-10 flex flex-col gap-3 border-y border-border py-4 md:flex-row md:items-center md:justify-between"
          aria-label="Filtri risorse"
          role="group"
        >
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={typeFilter === f.value}
                onClick={() => setTypeFilter(f.value)}
                className={
                  chipBase +
                  " " +
                  (typeFilter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground/70 hover:border-primary hover:text-primary")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="risorse-citta">Città</label>
            <select
              id="risorse-citta"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value as CityTag | "all")}
              className={selectBase}
            >
              {CITY_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="risorse-ordine">Ordina per data</label>
            <select
              id="risorse-ordine"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className={selectBase}
            >
              <option value="newest">Più recenti</option>
              <option value="oldest">Meno recenti</option>
            </select>
          </div>
        </div>

        {noFilters && (
          <>
            <IsaiahLeadCard />
            <ScriptureDivider />
          </>
        )}

        {loading ? (
          <p className="text-center py-20 text-muted-foreground">Caricamento risorse…</p>
        ) : nothing ? (
          <p className="text-center py-20 text-muted-foreground">
            Nessuna risorsa trovata con questi filtri.
          </p>
        ) : (
          <>
            {gridItems.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((item) => (
                  <ResourceCard key={`r-${item.r.id}`} r={item.r} />
                ))}
              </div>
            )}
            {(devItems.length > 0 || showIsaiahInDevotionals) && (
              <section className={gridItems.length > 0 ? "mt-16" : ""} aria-labelledby="devozionali-title">
                <h2 id="devozionali-title" className="font-display text-3xl text-foreground mb-6">Devozionali</h2>
                {showIsaiahInDevotionals && <div className="mb-8"><IsaiahLeadCard /></div>}
                <ul className="divide-y divide-border">
                  {devItems.map((item) => (
                    <li key={`d-${item.d.id}`}>
                      <DevotionalRow d={item.d} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </section>
    </>
  );
}

function ScriptureDivider() {
  return (
    <figure className="my-14 md:my-20 mx-auto max-w-3xl text-center">
      <div className="mx-auto h-px w-24 bg-border" aria-hidden="true" />
      <blockquote className="my-8 font-display italic text-2xl md:text-4xl leading-snug text-foreground text-balance">
        «La tua parola è una lampada al mio piede e una luce sul mio cammino.»
      </blockquote>
      <figcaption className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Salmo 119:105</figcaption>
      <div className="mx-auto mt-8 h-px w-24 bg-border" aria-hidden="true" />
    </figure>
  );
}

export function ResourceCard({ r }: { r: Resource }) {
  const isPlayable = r.type === "video" || r.type === "sermon";
  const isSermon = r.type === "sermon";
  const ytId = r.media_url ? getYouTubeId(r.media_url) : null;
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null;
  const linkProps = {
    to: isSermon ? ("/sermoni/$slug" as const) : ("/risorse/$slug" as const),
    params: { slug: r.slug },
  };
  if (!thumb) {
    return (
      <Link
        {...linkProps}
        className="group flex min-h-[240px] flex-col rounded-2xl border border-primary/15 bg-primary/5 p-7 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
          <span className="font-medium">{RESOURCE_TYPE_LABELS[r.type]}</span>
          <span className="text-muted-foreground"> · {formatItalianDate(r.published_at)}</span>
        </p>
        <h3 className="mt-5 font-display text-3xl leading-[1.1] text-foreground text-balance group-hover:text-primary transition-colors">
          {r.title}
        </h3>
        {r.speaker_or_author && (
          <p className="mt-auto pt-6 text-sm text-foreground/70">{r.speaker_or_author}</p>
        )}
      </Link>
    );
  }
  return (
    <Link
      {...linkProps}
      className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-video bg-foreground">
        <img src={thumb} alt={r.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        {isPlayable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-background/95 text-primary flex items-center justify-center shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
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

function DevotionalRow({ d }: { d: Devotional }) {
  return (
    <Link
      to="/devozionale/$slug"
      params={{ slug: d.slug }}
      className="group block border-l-2 border-primary/60 my-4 pl-5 py-2 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <h3 className="font-display text-2xl text-foreground leading-tight group-hover:text-primary transition-colors">
        {d.title}
      </h3>
      {d.scripture_ref && <p className="mt-1 font-display italic text-primary/80">{d.scripture_ref}</p>}
      <p className="mt-2 text-xs text-muted-foreground">
        Settimana del {formatItalianDate(d.week_of)}
        {d.author && ` · ${d.author}`}
      </p>
    </Link>
  );
}

function IsaiahLeadCard() {
  const { pct, completed, total } = useCourseProgress("isaia", 67);
  const hasStarted = completed > 0;
  return (
    <Link
      to="/milano/devozionale"
      className="group grid overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
        <img src={bibleStudy} alt="Bibbia aperta durante uno studio" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-col p-7 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary">Corso · 67 giorni</p>
        <h2 className="mt-4 font-display text-3xl md:text-4xl text-foreground leading-tight group-hover:text-primary transition-colors">
          Isaia — Il Signore è salvezza
        </h2>
        <p className="mt-3 font-display italic text-primary/80">
          «Non temere, perché io sono con te» — Isaia 41:10
        </p>
        <p className="mt-4 text-sm text-foreground/70">
          66 giorni attraverso il libro di Isaia: contesto storico, domande sul testo e domande per la vita.
        </p>
        {hasStarted ? (
          <div className="mt-auto pt-8">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-foreground/60">{completed} / {total} giorni completati</p>
              <p className="text-xs text-primary font-medium">{pct}%</p>
            </div>
            <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : (
          <p className="mt-auto pt-8 text-sm font-medium text-primary">Inizia da Giorno 0 · Introduzione →</p>
        )}
      </div>
    </Link>
  );
}

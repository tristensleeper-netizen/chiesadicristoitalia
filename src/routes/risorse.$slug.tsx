import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  formatItalianDate,
  isSpotifyUrl,
  isVimeoUrl,
  isYouTubeUrl,
  toEmbedUrl,
  type Resource,
} from "@/lib/resource-helpers";

export const Route = createFileRoute("/risorse/$slug")({
  component: ResourceDetail,
});

function ResourceDetail() {
  const { slug } = Route.useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!active) return;
      if (error) console.error(error);
      if (!data) {
        setNotFoundState(true);
      } else {
        setResource(data);
        document.title = `${data.title} — Chiesa di Cristo`;
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-prose py-32 text-center text-muted-foreground">
        Caricamento…
      </div>
    );
  }

  if (notFoundState || !resource) {
    return (
      <div className="container-prose py-32 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-4xl mb-6">Risorsa non trovata</h1>
        <Link to="/risorse" className="btn-primary">Torna alle risorse</Link>
      </div>
    );
  }

  const r = resource;
  const embedUrl = r.media_url ? toEmbedUrl(r.media_url) : null;
  const isEmbeddable =
    embedUrl && (isYouTubeUrl(embedUrl) || isVimeoUrl(embedUrl) || isSpotifyUrl(embedUrl));
  const isPdf = r.type === "pdf" && r.media_url;

  return (
    <article className="pt-32 pb-20">
      <div className="container-narrow">
        <Link
          to="/risorse"
          className="inline-block mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
          ← Tutte le risorse
        </Link>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
            {RESOURCE_TYPE_LABELS[r.type]}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {CITY_TAG_LABELS[r.city_tag]}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl leading-tight text-foreground">
          {r.title}
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {formatItalianDate(r.published_at)}
          {r.speaker_or_author && ` · ${r.speaker_or_author}`}
          {r.scripture_ref && ` · ${r.scripture_ref}`}
        </p>

        {r.description && (
          <p className="mt-8 text-lg text-foreground/80 leading-relaxed">{r.description}</p>
        )}

        {isEmbeddable && (
          <div className={"mt-10 overflow-hidden rounded-2xl border border-border " + (isSpotifyUrl(embedUrl) ? "" : "aspect-video")}>
            <iframe
              src={embedUrl}
              title={r.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              style={isSpotifyUrl(embedUrl) ? { height: 232 } : undefined}
            />
          </div>
        )}

        {isPdf && (
          <a
            href={r.media_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 btn-primary"
          >
            ↓ Scarica il PDF
          </a>
        )}

        {r.body && (
          <div className="prose-content mt-12 text-foreground/85 leading-relaxed whitespace-pre-line">
            {r.body}
          </div>
        )}
      </div>
    </article>
  );
}

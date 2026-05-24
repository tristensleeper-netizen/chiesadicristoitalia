import { Link } from "@tanstack/react-router";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  formatItalianDate,
  getYouTubeId,
  isSpotifyUrl,
  isVimeoUrl,
  isYouTubeUrl,
  toEmbedUrl,
  type Resource,
} from "@/lib/resource-helpers";

type BackTarget =
  | { to: "/risorse"; label: string }
  | { to: "/sermoni"; label: string };

export function ResourceDetailView({
  resource,
  back,
}: {
  resource: Resource;
  back: BackTarget;
}) {
  const r = resource;
  const embedUrl = r.media_url ? toEmbedUrl(r.media_url) : null;
  const isEmbeddable =
    embedUrl && (isYouTubeUrl(embedUrl) || isVimeoUrl(embedUrl) || isSpotifyUrl(embedUrl));
  const isPdf = r.type === "pdf" && r.media_url;

  return (
    <article className="pt-32 pb-20">
      <div className="container-narrow">
        <Link
          to={back.to}
          className="inline-block mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
          ← {back.label}
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
          <>
            <div
              className={
                "mt-10 overflow-hidden rounded-2xl border border-border " +
                (isSpotifyUrl(embedUrl) ? "" : "aspect-video")
              }
            >
              <iframe
                src={embedUrl}
                title={r.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                style={isSpotifyUrl(embedUrl) ? { height: 232 } : undefined}
              />
            </div>
            {r.media_url && (isYouTubeUrl(r.media_url) || isVimeoUrl(r.media_url)) && (
              <div className="mt-4 flex justify-end">
                <a
                  href={r.media_url}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {isYouTubeUrl(r.media_url) ? "Guarda su YouTube" : "Guarda su Vimeo"}
                  <span aria-hidden>↗</span>
                </a>
              </div>
            )}
          </>
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

export function buildResourceHead({
  resource,
  slug,
  basePath,
  siteUrl,
}: {
  resource: Resource | null;
  slug: string;
  basePath: "/risorse" | "/sermoni";
  siteUrl: string;
}) {
  if (!resource) {
    return {
      meta: [
        { title: "Risorsa non trovata — Chiesa di Cristo Italia" },
        { name: "robots", content: "noindex" },
      ],
    };
  }
  const r = resource;
  const canonical = `${siteUrl}${basePath}/${slug}`;
  const ytId = r.media_url ? getYouTubeId(r.media_url) : null;
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;
  const title = `${r.title} — ${r.speaker_or_author ?? "Chiesa di Cristo"} | Chiesa di Cristo Italia`;
  const desc = r.description ?? `${r.title} — risorsa cristiana dalla Chiesa di Cristo Italia.`;
  const ogType = r.type === "video" || r.type === "sermon" ? "video.other" : "article";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: desc },
    { name: "language", content: "it" },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:type", content: ogType },
    { property: "og:url", content: canonical },
    { property: "og:locale", content: "it_IT" },
    { property: "og:site_name", content: "Chiesa di Cristo Italia" },
    { name: "twitter:card", content: thumb ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
  ];
  if (thumb) {
    meta.push({ property: "og:image", content: thumb });
    meta.push({ name: "twitter:image", content: thumb });
  }

  const isVideo = r.type === "video" || r.type === "sermon";
  const jsonLd: Record<string, unknown> = isVideo
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: r.title,
        description: desc,
        thumbnailUrl: ytId
          ? [`https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`]
          : undefined,
        uploadDate: r.published_at,
        contentUrl: ytId
          ? `https://www.youtube.com/watch?v=${ytId}`
          : r.media_url ?? undefined,
        embedUrl: ytId ? `https://www.youtube.com/embed/${ytId}` : undefined,
        inLanguage: "it",
        isFamilyFriendly: true,
        publisher: {
          "@type": "Organization",
          name: "Chiesa di Cristo in Italia",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/og-image.jpg`,
            width: 600,
            height: 60,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: r.title,
        description: desc,
        inLanguage: "it",
        url: canonical,
        datePublished: r.published_at,
        author: { "@type": "Person", name: r.speaker_or_author ?? "Chiesa di Cristo" },
        publisher: {
          "@type": "Organization",
          name: "Chiesa di Cristo Italia",
          url: siteUrl,
        },
      };
  if (!isVideo && thumb) jsonLd.thumbnailUrl = thumb;

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  };
}

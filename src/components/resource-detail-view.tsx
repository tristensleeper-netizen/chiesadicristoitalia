import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import bibleStudy from "@/assets/bible-study.jpg";
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
  const jsonLd = buildResourceJsonLd({
    resource: r,
    slug: r.slug,
    basePath: back.to,
    siteUrl: "https://chiesadicristoitalia.it",
  });

  return (
    <article className="pt-24 md:pt-28 pb-20">
      <div className="container-narrow">
        <Link
          to={back.to}
          className="inline-block mb-6 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← {back.to === "/risorse" ? "Tutte le risorse" : back.label}
        </Link>
        <p className="mb-4 text-sm text-primary">
          {sentenceCase(RESOURCE_TYPE_LABELS[r.type])} · {sentenceCase(CITY_TAG_LABELS[r.city_tag])}
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight text-foreground">
          {r.title}
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {formatItalianDate(r.published_at)}
          {r.speaker_or_author && ` · ${r.speaker_or_author}`}
          {r.scripture_ref && ` · ${r.scripture_ref}`}
        </p>

        {r.description && r.type !== "article" && (
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

        {r.body && <ArticleBody body={r.body} />}

        {r.type === "article" && r.media_url && (
          <div className="mt-8 max-w-[65ch]">
            <a
              href={r.media_url}
              target="_blank"
              rel="noopener"
              className="text-base font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Leggi l'articolo completo ↗
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Questo articolo è stato pubblicato nella newsletter{" "}
              <a
                href="https://nellalucedelfaro.beehiiv.com/"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Nella Luce del Faro
              </a>
            </p>
          </div>
        )}

        {r.type === "article" && <ArticleFooter resource={r} />}
      </div>
    </article>
  );
}

function sentenceCase(s: string) {
  if (!s) return s;
  const lower = s.toLocaleLowerCase("it-IT");
  return lower.charAt(0).toLocaleUpperCase("it-IT") + lower.slice(1);
}

// A paragraph is styled as a quote only when it is clearly one: fully wrapped in
// «», "" or “”, or starting with a Bible reference such as "Giovanni 3:16" or "1 Pietro 2:9".
const BIBLE_REF_START = /^(?:[123]\s?)?[A-ZÀ-Ý][a-zà-ÿ]{1,14}\.?\s\d{1,3}[:,]\d{1,3}/;
function isQuote(p: string) {
  const t = p.trim();
  if (/^«[\s\S]+»[.,;]?$/.test(t)) return true;
  if (/^"[\s\S]+"[.,;]?$/.test(t)) return true;
  if (/^“[\s\S]+”[.,;]?$/.test(t)) return true;
  return BIBLE_REF_START.test(t);
}

function ArticleBody({ body }: { body: string }) {
  const paras = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="mt-12 max-w-[65ch] text-[1.125rem] leading-[1.75] text-foreground/85">
      {paras.map((p, i) =>
        isQuote(p) ? (
          <blockquote
            key={i}
            className="my-8 border-l-2 border-primary/50 pl-5 font-display italic text-foreground/90 whitespace-pre-line"
          >
            {p}
          </blockquote>
        ) : (
          <p key={i} className="mb-6 last:mb-0 whitespace-pre-line">
            {p}
          </p>
        ),
      )}
    </div>
  );
}

type RelatedRow = { id: string; slug: string; title: string; published_at: string };

function ArticleFooter({ resource }: { resource: Resource }) {
  const [related, setRelated] = useState<RelatedRow[]>([]);
  useEffect(() => {
    let active = true;
    supabase
      .from("resources")
      .select("id, slug, title, published_at")
      .eq("published", true)
      .eq("type", resource.type)
      .neq("id", resource.id)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active && data) setRelated(data as RelatedRow[]);
      });
    return () => {
      active = false;
    };
  }, [resource.id, resource.type]);

  return (
    <div className="mt-16 max-w-[65ch] border-t border-border pt-10">
      <p className="text-lg text-foreground/85 leading-relaxed">
        Se queste parole ti hanno toccato, vieni a conoscerci di persona: la porta è aperta.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base">
        <Link to="/milano/visita" className="text-primary underline underline-offset-4 hover:opacity-80">
          Vieni a una funzione a Milano
        </Link>
        <Link to="/bologna/visita" className="text-primary underline underline-offset-4 hover:opacity-80">
          Camminiamo insieme a Bologna
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl text-foreground">Continua a leggere</h2>
          <ul className="mt-4 divide-y divide-border">
            {related.map((x) => (
              <li key={x.id}>
                <Link
                  to="/risorse/$slug"
                  params={{ slug: x.slug }}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 hover:text-primary transition-colors"
                >
                  <span className="text-foreground">{x.title}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {formatItalianDate(x.published_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
    { name: "twitter:card", content: thumb || r.type === "article" ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
  ];
  if (thumb) {
    meta.push({ property: "og:image", content: thumb });
    meta.push({ name: "twitter:image", content: thumb });
  } else if (r.type === "article") {
    const fallback = bibleStudy.startsWith("http") ? bibleStudy : `${siteUrl}${bibleStudy}`;
    meta.push({ property: "og:image", content: fallback });
    meta.push({ name: "twitter:image", content: fallback });
  }

  const jsonLd = buildResourceJsonLd({ resource: r, slug, basePath, siteUrl });

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
    scripts: jsonLd
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(jsonLd),
          },
        ]
      : [],
  };
}

export function buildResourceJsonLd({
  resource,
  slug,
  basePath,
  siteUrl,
}: {
  resource: Resource;
  slug: string;
  basePath: "/risorse" | "/sermoni";
  siteUrl: string;
}): Record<string, unknown> {
  const r = resource;
  const canonical = `${siteUrl}${basePath}/${slug}`;
  const ytId = r.media_url ? getYouTubeId(r.media_url) : null;
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;
  const desc = r.description ?? `${r.title} — risorsa cristiana dalla Chiesa di Cristo Italia.`;
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
  return jsonLd;
}


import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { formatItalianDate, type Devotional } from "@/lib/resource-helpers";

const SITE_URL = "https://chiesadicristoitalia.it";

export const Route = createFileRoute("/devozionale/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("devotionals")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    return { devotional: (data as Devotional | null) ?? null };
  },
  head: ({ loaderData, params }) => {
    const d = loaderData?.devotional;
    const canonical = `${SITE_URL}/devozionale/${params.slug}`;
    if (!d) {
      return {
        meta: [
          { title: "Devozionale non trovato — Chiesa di Cristo Italia" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: canonical }],
      };
    }
    const title = `${d.title} — Devozionale | Chiesa di Cristo`;
    const raw = (d.body ?? "").replace(/\s+/g, " ").trim();
    const excerpt = raw.length > 155 ? raw.slice(0, 152).trimEnd() + "…" : raw;
    const desc = excerpt || `Devozionale: ${d.title}${d.scripture_ref ? ` — ${d.scripture_ref}` : ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: DevotionalDetail,
});

function DevotionalDetail() {
  const { slug } = Route.useParams();
  const [d, setD] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!active) return;
      if (error) console.error(error);
      if (!data) setMissing(true);
      else {
        setD(data);
        document.title = `${data.title} — Devozionale | Chiesa di Cristo`;
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

  if (missing || !d) {
    return (
      <div className="container-prose py-32 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-3xl mb-6">Devozionale non trovato</h1>
        <Link to="/risorse" className="btn-primary">
          Torna alle risorse
        </Link>
      </div>
    );
  }

  return (
    <article className="container-narrow py-20 md:py-24">
      <Link
        to="/risorse"
        className="text-sm text-muted-foreground hover:text-primary"
      >
        ← Tutte le risorse
      </Link>
      <p className="eyebrow mt-8 mb-4">
        Devozionale · Settimana del {formatItalianDate(d.week_of)}
      </p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
        {d.title}
      </h1>
      {d.scripture_ref && (
        <p className="mt-4 font-display italic text-xl text-primary">
          {d.scripture_ref}
        </p>
      )}
      <div className="mt-8 text-foreground/85 leading-relaxed text-lg whitespace-pre-line">
        {d.body}
      </div>
      {d.author && (
        <p className="mt-8 text-sm text-muted-foreground">— {d.author}</p>
      )}
    </article>
  );
}

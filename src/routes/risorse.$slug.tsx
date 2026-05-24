import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { type Resource } from "@/lib/resource-helpers";
import {
  ResourceDetailView,
  buildResourceHead,
} from "@/components/resource-detail-view";

const SITE_URL = "https://chiesadicristoitalia.it";

const JUNK_SLUGS = new Set(["performance", "avengers", "followers"]);

export const Route = createFileRoute("/risorse/$slug")({
  loader: async ({ params }) => {
    // Junk URLs accidentally indexed in the past — 301 back to the archive.
    if (JUNK_SLUGS.has(params.slug)) {
      throw redirect({ to: "/risorse", statusCode: 301 });
    }
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    const resource = (data as Resource | null) ?? null;
    // Sermons live at /sermoni/$slug for SEO. 301 redirect anyone hitting the
    // old /risorse/ URL so link equity transfers to the new canonical.
    if (resource && resource.type === "sermon") {
      throw redirect({
        to: "/sermoni/$slug",
        params: { slug: params.slug },
        statusCode: 301,
      });
    }
    return { resource };
  },
  head: ({ loaderData, params }) =>
    buildResourceHead({
      resource: loaderData?.resource ?? null,
      slug: params.slug,
      basePath: "/risorse",
      siteUrl: SITE_URL,
    }),
  component: ResourceDetail,
});

function ResourceDetail() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData().resource;
  const [resource, setResource] = useState<Resource | null>(initial);
  const [loading, setLoading] = useState(initial === null);
  const [notFoundState, setNotFoundState] = useState(initial === null);

  useEffect(() => {
    if (initial) return;
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
      if (!data) setNotFoundState(true);
      else {
        setResource(data as Resource);
        setNotFoundState(false);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug, initial]);

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
        <Link to="/risorse" className="btn-primary">
          Torna alle risorse
        </Link>
      </div>
    );
  }

  return (
    <ResourceDetailView
      resource={resource}
      back={{ to: "/risorse", label: "Tutte le risorse" }}
    />
  );
}

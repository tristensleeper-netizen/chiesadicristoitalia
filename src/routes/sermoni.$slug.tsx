import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { type Resource } from "@/lib/resource-helpers";
import {
  ResourceDetailView,
  buildResourceHead,
} from "@/components/resource-detail-view";

const SITE_URL = "https://chiesadicristoitalia.it";

export const Route = createFileRoute("/sermoni/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    const resource = (data as Resource | null) ?? null;
    // /sermoni/$slug is only for sermon-type resources. If something else
    // shares the slug, redirect to the canonical /risorse/$slug location.
    if (resource && resource.type !== "sermon") {
      throw redirect({
        to: "/risorse/$slug",
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
      basePath: "/sermoni",
      siteUrl: SITE_URL,
    }),
  component: SermonDetail,
});

function SermonDetail() {
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
        <h1 className="font-display text-4xl mb-6">Sermone non trovato</h1>
        <Link to="/sermoni" className="btn-primary">
          Tutti i sermoni
        </Link>
      </div>
    );
  }

  return (
    <ResourceDetailView
      resource={resource}
      back={{ to: "/sermoni", label: "Tutti i sermoni" }}
    />
  );
}

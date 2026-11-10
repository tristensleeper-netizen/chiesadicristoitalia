import { createFileRoute, Link, redirect, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { type Resource } from "@/lib/resource-helpers";
import {
  ResourceDetailView,
  buildResourceHead,
} from "@/components/resource-detail-view";

const SITE_URL = "https://chiesadicristoitalia.it";

const getPublishedResource = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Risorse temporaneamente non disponibili.");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          headers.set("apikey", key);
          if (key.startsWith("sb_")) headers.delete("Authorization");
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { data, error } = await client.from("resources").select("*")
      .eq("slug", slug).eq("published", true).maybeSingle();
    if (error) throw new Error("Risorse temporaneamente non disponibili.");
    return data as Resource | null;
  });

export const Route = createFileRoute("/sermoni/$slug")({
  loader: async ({ params }) => {
    const resource = await getPublishedResource({ data: params.slug });
    if (!resource) throw notFound();
    // /sermoni/$slug serves both sermon and video resources. Anything else
    // (article, pdf, etc.) redirects to its canonical /risorse/$slug location.
    if (resource && resource.type !== "sermon" && resource.type !== "video") {
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
  errorComponent: () => <div role="alert" className="container-prose py-32 text-center">Risorse temporaneamente non disponibili.</div>,
  notFoundComponent: () => (
    <div className="container-prose py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl mb-6">Sermone non trovato</h1>
      <Link to="/sermoni" className="btn-primary">Tutti i sermoni</Link>
    </div>
  ),
  component: SermonDetail,
});

function SermonDetail() {
  const { resource } = Route.useLoaderData();

  return (
    <ResourceDetailView
      resource={resource}
      back={{ to: "/sermoni", label: "Tutti i sermoni" }}
    />
  );
}

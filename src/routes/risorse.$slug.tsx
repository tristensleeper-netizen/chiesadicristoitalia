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

const JUNK_SLUGS = new Set(["performance", "avengers", "followers"]);

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

export const Route = createFileRoute("/risorse/$slug")({
  loader: async ({ params }) => {
    // Junk URLs accidentally indexed in the past — 301 back to the archive.
    if (JUNK_SLUGS.has(params.slug)) {
      throw redirect({ to: "/risorse", statusCode: 301 });
    }
    const resource = await getPublishedResource({ data: params.slug });
    if (!resource) throw notFound();
    // All video content (sermons + videos) lives at /sermoni/$slug for SEO.
    // 301 redirect anyone hitting the old /risorse/ URL so link equity
    // transfers to the new canonical.
    if (resource && (resource.type === "sermon" || resource.type === "video")) {
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
  errorComponent: () => <div role="alert" className="container-prose py-32 text-center">Risorse temporaneamente non disponibili.</div>,
  notFoundComponent: () => (
    <div className="container-prose py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl mb-6">Risorsa non trovata</h1>
      <Link to="/risorse" className="btn-primary">Torna alle risorse</Link>
    </div>
  ),
  component: ResourceDetail,
});

function ResourceDetail() {
  const { resource } = Route.useLoaderData();

  return (
    <ResourceDetailView
      resource={resource}
      back={{ to: "/risorse", label: "Tutte le risorse" }}
    />
  );
}

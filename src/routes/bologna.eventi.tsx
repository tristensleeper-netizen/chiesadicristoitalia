import { createFileRoute } from "@tanstack/react-router";
import { EventsSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/eventi")({
  head: () => ({
    meta: [
      { title: "Eventi — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Funzioni, studi biblici, cene comunitarie ed eventi a Bologna." },
      { property: "og:title", content: "Eventi — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "La vita della comunità a Bologna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/eventi" }],
  }),
  component: () => <EventsSection city={bolognaConfig} />,
});

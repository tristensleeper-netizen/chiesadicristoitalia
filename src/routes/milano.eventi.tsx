import { createFileRoute } from "@tanstack/react-router";
import { EventsSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";

export const Route = createFileRoute("/milano/eventi")({
  head: () => ({
    meta: [
      { title: "Eventi — Chiesa di Cristo di Milano" },
      { name: "description", content: "Funzioni, studi biblici, cene comunitarie e progetti di servizio a Milano." },
      { property: "og:title", content: "Eventi — Chiesa di Cristo di Milano" },
      { property: "og:description", content: "La vita della comunità a Milano." },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/eventi" }],
  }),
  component: () => <EventsSection city={milanoConfig} />,
});

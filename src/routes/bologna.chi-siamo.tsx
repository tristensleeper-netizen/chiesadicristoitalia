import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Conosci la Chiesa di Cristo di Bologna: una nuova comunità cristiana senza una sede. Il luogo degli incontri è da confermare." },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Una nuova comunità cristiana a Bologna. Ti aspettiamo la domenica." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/chi-siamo" }],
  }),
  component: () => <AboutSection city={bolognaConfig} />,
});

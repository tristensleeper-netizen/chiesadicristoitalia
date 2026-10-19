import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Conosci la Chiesa di Cristo di Bologna: una nuova comunità cristiana che si ritrova ogni domenica alle 10:30 all'Hotel Europa, Via Cesare Boldrini 11." },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Una nuova comunità cristiana a Bologna. Ti aspettiamo la domenica." },
      { property: "og:image", content: heroBologna },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/chi-siamo" }],
  }),
  component: () => <AboutSection city={bolognaConfig} />,
});

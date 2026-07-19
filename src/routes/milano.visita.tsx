import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";
import heroMilano from "@/assets/hero-milano.jpg";

const summerConfig = {
  ...milanoConfig,
  address: "Piazza S. Matteo, 24",
  cap: "20093 Cologno Monzese",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Piazza+S.+Matteo,+24,+20093+Cologno+Monzese+MI",
};

export const Route = createFileRoute("/milano/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Milano — Domenica 10:30" },
      { name: "description", content: "Vieni a trovarci a Cologno Monzese (Piazza S. Matteo, 24) fino ad agosto. Funzione domenicale alle 10:30. Tutti sono benvenuti." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Milano" },
      { property: "og:description", content: "Domenica 10:30 · Piazza S. Matteo, 24, Cologno Monzese (fino ad agosto 2026)." },
      { property: "og:image", content: heroMilano },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/visita" }],
  }),
  component: () => <VisitSection city={summerConfig} />,
});

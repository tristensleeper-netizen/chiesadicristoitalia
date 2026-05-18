import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";
import heroMilano from "@/assets/hero-milano.jpg";

export const Route = createFileRoute("/milano/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Milano — Domenica 10:30" },
      { name: "description", content: "Vieni a trovarci in Corso di Porta Vigentina 15a. Funzione domenicale alle 10:30. Tutti sono benvenuti." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Milano" },
      { property: "og:description", content: "Domenica 10:30 · Corso di Porta Vigentina 15a, Milano." },
      { property: "og:image", content: heroMilano },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/visita" }],
  }),
  component: () => <VisitSection city={milanoConfig} />,
});

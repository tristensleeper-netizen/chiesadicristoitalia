import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Bologna — Domenica 10:30" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Bologna si ritrova ogni domenica alle 10:30 — Hotel Europa, Sala Madrid, Via Cesare Boldrini 11 (a 3 minuti dalla Stazione Centrale). Tutti sono benvenuti.",
      },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content:
          "Ogni domenica alle 10:30 · Hotel Europa – Sala Madrid, Via Cesare Boldrini 11, Bologna.",
      },
      { property: "og:image", content: heroBologna },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/visita" }],
  }),
  component: () => <VisitSection city={bolognaConfig} />,
});

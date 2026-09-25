import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Bologna — Inaugurazione 4 ottobre 2026" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Bologna inaugura le sue funzioni domenicali domenica 4 ottobre 2026 alle 10:30 — Hotel Europa, Sala Madrid, Via Cesare Boldrini 11 (a 3 minuti dalla Stazione Centrale). Tutti sono benvenuti.",
      },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content:
          "Inaugurazione domenica 4 ottobre 2026, 10:30 · Hotel Europa – Sala Madrid, Via Cesare Boldrini 11, Bologna.",
      },
      { property: "og:image", content: heroBologna },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/visita" }],
  }),
  component: () => <VisitSection city={bolognaConfig} />,
});

import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Bologna — Domenica 11:00" },
      { name: "description", content: "Vieni a trovarci nel centro di Bologna. Funzione domenicale alle 11:00. Tutti sono benvenuti." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Domenica 11:00, nel cuore di Bologna." },
      { property: "og:image", content: heroBologna },
    ],
  }),
  component: () => <VisitSection city={bolognaConfig} />,
});

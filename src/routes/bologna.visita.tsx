import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Bologna — Lancio settembre 2026" },
      { name: "description", content: "La Chiesa di Cristo di Bologna è in preparazione: lancio previsto per settembre 2026. Scrivici per uno studio biblico o per restare aggiornato." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Church plant in arrivo a settembre 2026. Cammina con noi." },
      { property: "og:image", content: heroBologna },
    ],
  }),
  component: () => <VisitSection city={bolognaConfig} />,
});

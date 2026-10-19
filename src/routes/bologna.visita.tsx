import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/visita")({
  head: () => ({
    meta: [
      { title: "Incontraci — Chiesa di Cristo di Bologna" },
      {
        name: "description",
        content:
          "Vuoi incontrare la Chiesa di Cristo di Bologna? Non abbiamo un edificio di culto; il luogo degli incontri è da confermare. Scrivici prima di venire.",
      },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content:
          "Il luogo degli incontri a Bologna è da confermare. Scrivici per partecipare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/visita" }],
  }),
  component: () => <VisitSection city={bolognaConfig} />,
});

import { createFileRoute } from "@tanstack/react-router";
import { BeliefsSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/cosa-crediamo")({
  head: () => ({
    meta: [
      { title: "Cosa crediamo — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Cosa crede la Chiesa di Cristo di Bologna: una fede semplice fondata sulla Bibbia, su Gesù e sulla grazia, vissuta in comunità." },
      { property: "og:title", content: "Cosa crediamo — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Una fede semplice, biblica e viva." },
    ],
  }),
  component: () => <BeliefsSection city={bolognaConfig} />,
});

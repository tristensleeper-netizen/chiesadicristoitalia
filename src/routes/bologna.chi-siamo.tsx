import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Conosci la Chiesa di Cristo di Bologna: chi siamo, cosa ci muove, dove ci troviamo." },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Una famiglia spirituale nella dotta." },
      { property: "og:image", content: heroBologna },
    ],
  }),
  component: () => <AboutSection city={bolognaConfig} />,
});

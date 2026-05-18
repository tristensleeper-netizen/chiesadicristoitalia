import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";
import heroBologna from "@/assets/hero-bologna.jpg";

export const Route = createFileRoute("/bologna/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Conosci la Chiesa di Cristo di Bologna: una chiesa in fondazione, lancio previsto per settembre 2026." },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Una nuova comunità in arrivo a Bologna, settembre 2026." },
      { property: "og:image", content: heroBologna },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna/chi-siamo" }],
  }),
  component: () => <AboutSection city={bolognaConfig} />,
});

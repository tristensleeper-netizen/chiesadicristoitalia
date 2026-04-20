import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";
import heroMilano from "@/assets/hero-milano.jpg";

export const Route = createFileRoute("/milano/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo di Milano" },
      { name: "description", content: "Conosci la Chiesa di Cristo di Milano: la nostra visione, i nostri valori e perché ci ritroviamo." },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo di Milano" },
      { property: "og:description", content: "La nostra storia, la nostra fede, la nostra comunità." },
      { property: "og:image", content: heroMilano },
    ],
  }),
  component: () => <AboutSection city={milanoConfig} />,
});

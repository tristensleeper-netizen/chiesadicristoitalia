import { createFileRoute } from "@tanstack/react-router";
import { SermonsSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";

export const Route = createFileRoute("/milano/sermoni")({
  head: () => ({
    meta: [
      { title: "Sermoni — Chiesa di Cristo di Milano" },
      { name: "description", content: "Predicazioni e studi biblici dalla Chiesa di Cristo di Milano." },
      { property: "og:title", content: "Sermoni — Chiesa di Cristo di Milano" },
      { property: "og:description", content: "Ascolta, leggi, cresci nella fede." },
    ],
  }),
  component: () => <SermonsSection city={milanoConfig} />,
});

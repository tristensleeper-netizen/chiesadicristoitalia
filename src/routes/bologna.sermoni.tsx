import { createFileRoute } from "@tanstack/react-router";
import { SermonsSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/sermoni")({
  head: () => ({
    meta: [
      { title: "Sermoni — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Predicazioni e studi biblici dalla Chiesa di Cristo di Bologna." },
      { property: "og:title", content: "Sermoni — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Ascolta, leggi, cresci nella fede." },
    ],
  }),
  component: () => <SermonsSection city={bolognaConfig} />,
});

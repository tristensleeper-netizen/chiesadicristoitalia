import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/city-sections";
import { bolognaConfig } from "@/lib/cities";

export const Route = createFileRoute("/bologna/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Chiesa di Cristo di Bologna" },
      { name: "description", content: "Scrivici per visitarci o iniziare uno studio biblico a Bologna. Risposta entro 24 ore." },
      { property: "og:title", content: "Contatti — Chiesa di Cristo di Bologna" },
      { property: "og:description", content: "Facci sapere se verrai. Ti aspettiamo." },
    ],
  }),
  component: () => <ContactSection city={bolognaConfig} />,
});

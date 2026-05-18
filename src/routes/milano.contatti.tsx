import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";

export const Route = createFileRoute("/milano/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Chiesa di Cristo di Milano" },
      { name: "description", content: "Scrivici per visitarci, iniziare uno studio biblico o avere informazioni. Risposta entro 24 ore." },
      { property: "og:title", content: "Contatti — Chiesa di Cristo di Milano" },
      { property: "og:description", content: "Facci sapere se verrai. Ti aspettiamo." },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/contatti" }],
  }),
  component: () => <ContactSection city={milanoConfig} />,
});

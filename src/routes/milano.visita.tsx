import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";
import heroMilano from "@/assets/hero-milano.jpg";

export const Route = createFileRoute("/milano/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Milano — Domenica 10:30" },
      { name: "description", content: "Domenica 4 ottobre la funzione della chiesa di Milano si terrà a Bologna: Hotel Europa, Via Cesare Boldrini 11, ore 10:30. Questa settimana non siamo in Corso di Porta Vigentina." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Milano" },
      { property: "og:description", content: "Domenica 4 ottobre alle 10:30: funzione speciale a Bologna, Hotel Europa, Via Cesare Boldrini 11. Non ci sarà funzione a Milano." },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/visita" }],
  }),
  component: () => <VisitSection city={milanoConfig} />,
});

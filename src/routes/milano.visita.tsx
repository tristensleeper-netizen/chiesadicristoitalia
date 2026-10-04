import { createFileRoute } from "@tanstack/react-router";
import { VisitSection } from "@/components/city-sections";
import { milanoConfig } from "@/lib/cities";
import { isBolognaServiceDay } from "@/lib/special-service";

export const Route = createFileRoute("/milano/visita")({
  head: () => ({
    meta: [
      { title: "Visita la Chiesa di Cristo di Milano — Domenica 10:30" },
      { name: "description", content: isBolognaServiceDay() ? "Oggi, 4 ottobre, la funzione della chiesa di Milano si tiene a Bologna: Hotel Europa, Via Cesare Boldrini 11, ore 10:30. Nessuna funzione in Corso di Porta Vigentina." : "Visita la Chiesa di Cristo di Milano: ci ritroviamo ogni domenica alle 10:30 in Corso di Porta Vigentina 15a, 20122 Milano." },
      { property: "og:title", content: "Visita la Chiesa di Cristo di Milano" },
      { property: "og:description", content: isBolognaServiceDay() ? "Oggi, 4 ottobre alle 10:30: funzione speciale a Bologna, Hotel Europa, Via Cesare Boldrini 11. Nessuna funzione a Milano." : "Domenica alle 10:30 in Corso di Porta Vigentina 15a, Milano. Ti aspettiamo." },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano/visita" }],
  }),
  component: () => <VisitSection city={milanoConfig} />,
});

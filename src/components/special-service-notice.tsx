import { MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BOLOGNA_SERVICE, isBolognaServiceDay } from "@/lib/special-service";

export function SpecialServiceNotice({ context = "milano" }: { context?: "milano" | "bologna" | "italia" }) {
  if (!isBolognaServiceDay()) return null;

  return (
    <section aria-label="Avviso sulla funzione di oggi" className="border-y border-accent/40 bg-primary-soft">
      <div className="container-prose py-7 md:py-9">
        <p className="eyebrow text-primary">Avviso importante · Domenica 4 ottobre 2026</p>
        <h2 className="mt-2 font-display text-2xl md:text-4xl text-foreground leading-tight">
          Oggi ci ritroviamo a Bologna.
        </h2>
        <p className="mt-3 max-w-3xl text-foreground/80 leading-relaxed">
          Questa domenica non ci sarà la funzione nella sede di Milano in Corso di Porta Vigentina.
          {context === "bologna" ? " La comunità di Milano si unisce a noi" : " La comunità di Milano si unisce alla chiesa di Bologna"} per una funzione speciale
          alle {BOLOGNA_SERVICE.time}, all’{BOLOGNA_SERVICE.venue}, {BOLOGNA_SERVICE.address}, {BOLOGNA_SERVICE.locality}. Ti aspettiamo!
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={BOLOGNA_SERVICE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" /> Indicazioni per Bologna
          </a>
          <Link to="/bologna/visita" className="btn-outline">Dettagli della funzione</Link>
        </div>
      </div>
    </section>
  );
}
import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-prose py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M12 3v18M7 9h10" />
              </svg>
            </span>
            <span className="font-display text-xl">Chiesa di Cristo in Italia</span>
          </div>
          <p className="mt-5 max-w-md text-sm text-primary-foreground/75 leading-relaxed">
            Una famiglia spirituale che si incontra a Milano, Bologna, Napoli e in
            Sicilia. Cerchiamo di vivere il Vangelo con umiltà e di amare il
            prossimo come Gesù ci ha amati.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">
            Le nostre chiese
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/milano" className="hover:underline">Milano</Link></li>
            <li><Link to="/bologna" className="hover:underline">Bologna</Link></li>
            <li><Link to="/napoli" className="hover:underline">Napoli</Link></li>
            <li><Link to="/sicilia" className="hover:underline">Sicilia</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">
            Contatti
          </p>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            <li>info@chiesadicristoitalia.it</li>
            <li>Corso di Porta Vigentina 15a</li>
            <li>20122 Milano, MI</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-prose py-6 text-xs text-primary-foreground/60 flex flex-col md:flex-row gap-2 md:justify-between">
          <p>© {new Date().getFullYear()} Chiesa di Cristo in Italia. Tutti i diritti riservati.</p>
          <p>Ti aspettiamo questa domenica.</p>
        </div>
      </div>
    </footer>
  );
}

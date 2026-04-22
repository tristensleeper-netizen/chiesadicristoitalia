import { Clock, MapPin, Mail, ArrowUpRight } from "lucide-react";

interface CityInfoProps {
  city: "Milano" | "Bologna";
  address: string;
  cap: string;
  serviceTime: string;
  email?: string;
  mapsUrl: string;
}

export function CityInfoBlock({ city, address, cap, serviceTime, email, mapsUrl }: CityInfoProps) {
  const mailto = `mailto:${email ?? "info@chiesadicristoitalia.it"}`;

  return (
    <section className="container-prose py-16 md:py-20">
      <div className="grid gap-5 md:grid-cols-3">
        {/* Service time — primary, filled */}
        <div className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-xl md:p-9">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Clock className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <p className="eyebrow mb-3 text-white/70">Funzione domenicale</p>
            <p className="font-display text-3xl leading-tight md:text-4xl">{serviceTime}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Adorazione, comunione e una Parola viva. Tutti sono benvenuti — vieni come sei.
            </p>
          </div>
        </div>

        {/* Address — bordered with map accent */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] md:p-9"
        >
          <div className="absolute right-6 top-6 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
          <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="eyebrow mb-3">Dove ci troviamo</p>
          <p className="font-display text-2xl leading-tight text-foreground md:text-[1.6rem]">
            {address}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {cap} {city}, Italia
          </p>
          <p className="mt-5 text-sm font-medium text-primary">
            Apri in Maps
            <span className="inline-block transition-transform group-hover:translate-x-1"> →</span>
          </p>
        </a>

        {/* Email — soft accent surface */}
        <a
          href={mailto}
          className="group relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/8 p-8 transition-all hover:-translate-y-1 hover:bg-accent/15 hover:shadow-[var(--shadow-soft)] md:p-9"
          style={{ backgroundColor: "color-mix(in oklab, var(--accent) 10%, var(--card))" }}
        >
          <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-accent/15 blur-2xl transition-transform duration-700 group-hover:scale-125" />
          <div className="relative">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <p className="eyebrow mb-3">Scrivici</p>
            <p className="font-display text-xl leading-tight text-foreground break-all md:text-2xl">
              {email ?? "info@chiesadicristoitalia.it"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Rispondiamo entro 24 ore. Saremo felici di accoglierti — anche solo per un caffè.
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}

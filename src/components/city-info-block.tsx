import { Clock, MapPin, Mail, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface CityInfoProps {
  city: "Milano" | "Bologna";
  address: string;
  cap: string;
  serviceTime: string;
  email?: string;
  mapsUrl: string;
  visitPath?: string;
  contactPath?: string;
}

export function CityInfoBlock({
  city,
  address,
  cap,
  serviceTime,
  email,
  mapsUrl,
  visitPath,
  contactPath,
}: CityInfoProps) {
  const emailAddr = email ?? "info@chiesadicristoitalia.it";
  const mailto = `mailto:${emailAddr}`;
  const visitTo = visitPath ?? `/${city.toLowerCase()}/visita`;
  const contactTo = contactPath ?? `/${city.toLowerCase()}/contatti`;

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[40vw] w-[40vw] max-h-[480px] max-w-[480px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute -bottom-32 -right-20 h-[40vw] w-[40vw] max-h-[480px] max-w-[480px] rounded-full bg-accent/[0.10] blur-[120px]" />
      </div>

      <div className="container-prose relative py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">

          {/* 1. Funzione domenicale — deep filled */}
          <Link
            to={visitTo}
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
          >
            <div aria-hidden className="absolute right-4 top-4 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.14]">
              <Clock className="h-20 w-20" strokeWidth={1} />
            </div>
            <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary shadow-md ring-1 ring-accent/40 transition-transform duration-500 group-hover:rotate-12">
                <Clock className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-accent">
                Domenica
              </p>
              <h3 className="font-display text-2xl leading-tight">
                Ore <span className="text-accent italic">{serviceTime.replace(/^.*·\s*/, "")}</span>
              </h3>
              <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-primary-foreground/70">
                Adorazione, comunione e una Parola viva.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
              <span>Cosa aspettarsi</span>
              <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
          </Link>

          {/* 2. Indirizzo — clean white */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
          >
            <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-background to-card opacity-60" />
            <div aria-hidden className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/10" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                La nostra sede
              </p>
              <h3 className="font-display text-xl leading-snug text-foreground">{address}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {cap} {city}, Italia
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground">
                Google Maps
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
              </div>
            </div>
          </a>

          {/* 3. Email — soft glass with gold halo */}
          <Link
            to={contactTo}
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl border border-accent/40 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_color-mix(in_oklab,var(--accent)_50%,transparent)]"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--accent) 28%, var(--card)) 0%, color-mix(in oklab, var(--accent) 14%, var(--card)) 55%, var(--card) 100%)",
            }}
          >
            <div aria-hidden className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-accent/40 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_60%)]" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md ring-1 ring-accent/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Mail className="h-4 w-4" strokeWidth={2} />
              </div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Mettiti in contatto
              </p>
              <h3 className="font-display text-base leading-tight text-foreground break-words">
                {emailAddr}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/65">
                Rispondiamo entro 24 ore.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-300 group-hover:bg-foreground">
                Scrivici
              </span>
              <a
                href={mailto}
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/60 underline decoration-dotted underline-offset-4 hover:text-primary"
              >
                Mail diretta
              </a>
            </div>
          </Link>

          {/* 4. YouTube — cinematic */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-3xl bg-primary shadow-xl transition-all duration-500 hover:-translate-y-1.5"
          >
            {thumb && (
              <img
                src={thumb}
                alt="Anteprima video"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-1000 group-hover:scale-110"
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
            <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_60%,rgba(220,38,38,0.25),transparent_60%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  YouTube
                </span>
                <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </div>

              <div className="flex flex-col items-start">
                <div className="relative mb-3">
                  <div aria-hidden className="absolute inset-0 rounded-full bg-accent/30 blur-xl transition-all duration-500 group-hover:bg-accent/60 group-hover:scale-125" />
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/30 transition-all duration-500 group-hover:bg-accent group-hover:ring-accent group-hover:scale-110">
                    <Play className="h-5 w-5 translate-x-0.5 fill-white text-white transition-colors duration-500 group-hover:fill-primary group-hover:text-primary" strokeWidth={0} />
                  </div>
                </div>
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                  Conoscici in 2 minuti
                </p>
                <h3 className="font-display text-lg leading-tight">
                  Guarda il video di {city}
                </h3>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

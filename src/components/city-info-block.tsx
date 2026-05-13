import { Clock, MapPin, Mail, Play, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface CityInfoProps {
  city: "Milano" | "Bologna";
  address: string;
  cap: string;
  serviceTime: string;
  email?: string;
  mapsUrl: string;
  videoUrl?: string;
  videoThumb?: string;
  visitPath?: string;
  contactPath?: string;
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function CityInfoBlock({
  city,
  address,
  cap,
  serviceTime,
  email,
  mapsUrl,
  videoUrl = "https://youtu.be/bOobMSS-DuI?si=wZL0h5VQa0gHzEsA",
  visitPath,
  contactPath,
}: CityInfoProps) {
  const mailto = `mailto:${email ?? "info@chiesadicristoitalia.it"}`;
  const visitTo = visitPath ?? `/${city.toLowerCase()}/visita`;
  const contactTo = contactPath ?? `/${city.toLowerCase()}/contatti`;
  const ytId = getYouTubeId(videoUrl);
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;

  return (
    <section className="container-prose py-16 md:py-20">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. Service time — primary filled, links to /visita */}
        <Link
          to={visitTo}
          className="group relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-accent/25 blur-2xl transition-transform duration-700 group-hover:scale-110" />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20">
                <Clock className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <ArrowUpRight className="h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <p className="eyebrow mt-6 mb-2 text-white/70">Funzione domenicale</p>
            <p className="font-display text-3xl leading-tight md:text-[2rem]">{serviceTime}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Adorazione, comunione e una Parola viva. Vieni come sei.
            </p>
            <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-widest text-white/85">
              Cosa aspettarsi
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </p>
          </div>
        </Link>

        {/* 2. Address — bordered, opens Maps */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl"
        >
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-all duration-700 group-hover:bg-primary/15 group-hover:scale-125" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <ArrowUpRight className="h-5 w-5 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <p className="eyebrow mt-6 mb-2">Dove ci troviamo</p>
            <p className="font-display text-2xl leading-tight text-foreground">{address}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {cap} {city}, Italia
            </p>
            <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-widest text-primary">
              Apri in Maps
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </p>
          </div>
        </a>

        {/* 3. Email — accent surface, links to /contatti */}
        <Link
          to={contactTo}
          className="group relative overflow-hidden rounded-3xl border border-accent/30 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
          style={{ backgroundColor: "color-mix(in oklab, var(--accent) 10%, var(--card))" }}
        >
          <div className="absolute -right-14 -bottom-14 h-44 w-44 rounded-full bg-accent/20 blur-2xl transition-transform duration-700 group-hover:scale-125" />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklab,var(--accent)_25%,transparent),transparent_60%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground ring-1 ring-accent/25 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <ArrowUpRight className="h-5 w-5 -translate-x-1 text-accent-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <p className="eyebrow mt-6 mb-2">Scrivici</p>
            <p className="font-display text-xl leading-tight text-foreground break-all md:text-2xl">
              {email ?? "info@chiesadicristoitalia.it"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Rispondiamo entro 24 ore. Saremo felici di accoglierti.
            </p>
            <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-widest text-foreground/80">
              Contattaci
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="ml-2 text-foreground/50">o invia una mail</span>
              <a
                href={mailto}
                onClick={(e) => e.stopPropagation()}
                className="ml-1 underline decoration-dotted underline-offset-2 hover:text-primary"
              >
                diretta
              </a>
            </p>
          </div>
        </Link>

        {/* 4. YouTube video — opens YouTube in new tab */}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-3xl bg-foreground text-background transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          {thumb && (
            <img
              src={thumb}
              alt="Anteprima video"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_45%,rgba(220,38,38,0.35),transparent_60%)]" />

          <div className="relative flex h-full min-h-[240px] flex-col p-7 text-white">
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                YouTube
              </span>
              <ArrowUpRight className="h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>

            {/* Play button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div aria-hidden className="absolute inset-0 rounded-full bg-red-600/40 blur-xl transition-all duration-500 group-hover:bg-red-500/60 group-hover:scale-125" />
                <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600 ring-4 ring-white/15 transition-all duration-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:ring-white/25">
                  <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" strokeWidth={0} />
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <p className="eyebrow mb-2 text-white/70">Conoscici in 2 minuti</p>
              <p className="font-display text-xl leading-tight md:text-2xl">
                Guarda il video di {city}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/85">
                Riproduci su YouTube
                <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

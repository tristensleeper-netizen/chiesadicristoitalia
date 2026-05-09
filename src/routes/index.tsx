import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { useSlotImage } from "@/lib/use-slot-image";
import heroItalia from "@/assets/hero-italia.jpg";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";
import heroNapoli from "@/assets/hero-napoli.jpg";
import heroSicilia from "@/assets/hero-sicilia.jpg";
import sunsetItalia from "@/assets/sunset-italia.jpg";

const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Chiesa di Cristo in Italia",
  alternateName: "Church of Christ Italy",
  url: "https://www.chiesadicristoitalia.it",
  description:
    "Una chiesa cristiana basata sulla Bibbia, del movimento di restaurazione, con comunità a Milano e Bologna.",
  location: [
    {
      "@type": "Place",
      name: "Chiesa di Cristo di Milano",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Corso di Porta Vigentina 15a",
        postalCode: "20122",
        addressLocality: "Milano",
        addressCountry: "IT",
      },
    },
    {
      "@type": "Place",
      name: "Chiesa di Cristo di Bologna",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bologna",
        addressCountry: "IT",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo in Italia — Chiesa Cristiana a Milano e Bologna" },
      {
        name: "description",
        content:
          "Chiesa di Cristo in Italia: una chiesa cristiana basata sulla Bibbia, con comunità a Milano e Bologna. Vieni a trovarci questa domenica.",
      },
      { property: "og:title", content: "Chiesa di Cristo in Italia — Chiesa Cristiana a Milano e Bologna" },
      {
        property: "og:description",
        content:
          "Una chiesa cristiana basata sulla Bibbia. Comunità a Milano e Bologna. Tutti sono benvenuti.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(churchJsonLd),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const homeHero = useSlotImage("home.hero", heroItalia);
  const milanoImg = useSlotImage("home.milano", heroMilano);
  const bolognaImg = useSlotImage("home.bologna", heroBologna);
  const napoliImg = useSlotImage("home.napoli", heroNapoli);
  const siciliaImg = useSlotImage("home.sicilia", heroSicilia);
  return (
    <>
      <PageHero
        slot="home.hero"
        image={homeHero}
        eyebrow="Chiesa di Cristo · Italia"
        title={<>Una chiesa cristiana<br />a Milano e Bologna.</>}
        subtitle="Comunità di persone che cercano insieme di vivere come Gesù — una famiglia che ti aspetta."
        primaryCta={{ to: "/milano", label: "Trova la chiesa di Milano" }}
        secondaryCta={{ to: "/bologna", label: "Trova la chiesa di Bologna" }}
      />

      {/* Welcome + Scripture — one continuous editorial flow on a cream wash */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%), linear-gradient(180deg, var(--background), var(--primary-soft) 55%, var(--background))",
          }}
        />

        <div className="container-prose py-24 md:py-32">
          {/* Welcome */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-6">Benvenuti</p>
            <h2 className="font-display text-foreground leading-[1.15] text-3xl md:text-4xl lg:text-[2.75rem] font-normal">
              Gesù, un uomo semplice con un piano semplice:{" "}
              <em className="italic text-primary">far conoscere Dio e il suo amore.</em>
            </h2>
            <div className="mt-10 space-y-5 text-foreground/75 leading-relaxed text-base md:text-lg text-left md:text-center">
              <p>
                Siamo una <strong>chiesa cristiana</strong>: persone
                semplici che vogliono seguire le orme di Cristo, leggendo la Bibbia e
                vivendola ogni giorno. Non apparteniamo ad alcuna denominazione e ogni
                comunità locale è autonoma — quello che ci tiene insieme è la fede in
                Gesù e l'amore reciproco.
              </p>
              <p>
                La nostra fede si fonda esclusivamente sulla Bibbia. Crediamo nella
                potenza della preghiera, nelle amicizie sincere che ci avvicinano a Dio
                e in una comunità che accoglie chiunque, senza condizioni. Se vuoi
                approfondire,{" "}
                <Link to="/chi-siamo" className="text-primary underline-offset-4 hover:underline">
                  scopri chi siamo
                </Link>
                ,{" "}
                <Link to="/sermoni" className="text-primary underline-offset-4 hover:underline">
                  ascolta i nostri sermoni
                </Link>{" "}
                o{" "}
                <Link to="/risorse" className="text-primary underline-offset-4 hover:underline">
                  leggi articoli e guarda video
                </Link>
                .
              </p>
              <p>
                Se sei in Italia e stai cercando una famiglia spirituale, un posto dove
                sentirti a casa, la porta è aperta questa domenica oppure quando vuoi tu.
                <br />
                <span className="text-foreground/60 text-sm md:text-base italic">
                  English speakers are welcome — Sunday services are in Italian, with
                  translation available.
                </span>
              </p>
            </div>
          </div>

          {/* Delicate divider */}
          <div className="mx-auto my-20 md:my-24 flex items-center justify-center gap-4 max-w-xs">
            <span className="h-px flex-1 bg-primary/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <span className="h-px flex-1 bg-primary/25" />
          </div>

          {/* Scripture — editorial pull-quote */}
          <figure className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-6">Una promessa</p>
            <blockquote className="font-display italic text-foreground leading-[1.25] text-2xl md:text-3xl lg:text-[2.25rem] font-normal">
              <span className="text-primary/40 mr-1">«</span>
              E io ho fatto loro conoscere il tuo nome e lo farò conoscere ancora, affinché l'amore, del quale tu mi hai amato, sia in loro e io in loro.
              <span className="text-primary/40 ml-1">»</span>
            </blockquote>
            <figcaption className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Vangelo secondo Giovanni · 17:26
            </figcaption>
          </figure>
        </div>
      </section>


      {/* City selector */}
      <section className="relative container-prose pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-[120%] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "linear-gradient(90deg, oklch(0.85 0.16 35), oklch(0.84 0.14 200), oklch(0.85 0.15 320))" }}
        />
        <p className="eyebrow text-center mb-3">Dove vuoi incontrarci?</p>
        <h2 className="font-display text-center text-3xl md:text-4xl mb-12">Le nostre comunità</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <CityCard
            to="/milano"
            image={milanoImg}
            name="Milano"
            tagline="Chiesa di Cristo di Milano"
            description="Ci troviamo nel cuore di Milano. Funzione la domenica alle 10:30."
            accent="from-emerald-900/40 to-emerald-950/80"
          />
          <CityCard
            to="/bologna"
            image={bolognaImg}
            name="Bologna"
            tagline="Chiesa di Cristo di Bologna"
            description="Chiesa in fondazione. Lancio previsto per settembre 2026."
            accent="from-red-900/40 to-red-950/80"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <SmallCityCard
            to="/napoli"
            image={napoliImg}
            name="Napoli"
            description="Una piccola comunità che si incontra in casa. Scrivici per visitarci."
          />
          <SmallCityCard
            to="/sicilia"
            image={siciliaImg}
            name="Palermo"
            description="Una piccola comunità in casa. Saremmo felici di conoscerti."
          />
        </div>
      </section>

      {/* Beliefs — interactive pillars */}
      <section className="relative mt-16 overflow-hidden bg-primary-soft">
        {/* Floating scripture marquee */}
        <div className="marquee-mask overflow-hidden border-y border-primary/10 bg-primary/5 py-4">
          <div className="animate-marquee flex gap-12 whitespace-nowrap font-display text-2xl md:text-3xl text-primary/70">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12">
                <span>· Amati così come sei ·</span>
                <span>· Una famiglia in Cristo ·</span>
                <span>· La Parola che trasforma ·</span>
                <span>· Speranza per ogni città ·</span>
                <span>· Vieni come sei ·</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container-prose py-24 md:py-28">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Tre pilastri</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Cosa ci tiene <em className="not-italic text-primary">insieme</em>.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Bibbia",
                d: "La Parola di Dio guida ogni cosa che facciamo.",
                icon: "book",
                verse: "«La tua parola è una lampada al mio piede e una luce sul mio cammino.» — Salmo 119:105",
              },
              {
                t: "Comunità",
                d: "Amicizie profonde, sincere e quotidiane.",
                icon: "people",
                verse: "«Dove due o tre sono riuniti nel mio nome, lì sono io in mezzo a loro.» — Matteo 18:20",
              },
              {
                t: "Missione",
                d: "Portare speranza a chi ancora non l'ha trovata.",
                icon: "mission",
                verse: "«Andate dunque e fate discepoli di tutte le nazioni.» — Matteo 28:19",
              },
            ].map((item, i) => (
              <div
                key={item.t}
                className="group relative overflow-hidden rounded-3xl p-10 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default border border-primary/10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)]"
                style={{
                  animationDelay: `${i * 120}ms`,
                  background:
                    "radial-gradient(ellipse at top left, color-mix(in oklab, var(--primary-soft) 70%, transparent), var(--card) 65%)",
                }}
              >
                {/* Left vertical accent line */}
                <div className="pointer-events-none absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-primary/70" />

                {/* Top decorative hairline */}
                <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                {/* Animated gradient orb on hover */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(107,76,53,0.18)] bg-[#f7ede2] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {item.icon === "book" ? (
                      <svg
                        aria-hidden="true"
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                        <line x1="12" y1="7" x2="12" y2="14" />
                        <line x1="9" y1="10" x2="15" y2="10" />
                      </svg>
                    ) : item.icon === "people" ? (
                      <svg
                        aria-hidden="true"
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 20h10" />
                        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                        <path d="M14.1 6a7 7 0 0 1 1.1 4.1c-.8 0-1.6-.2-2.2-.7L14.1 6z" />
                        <path d="M14.1 6c.8-1.3 2-2.5 4-3.5-.1 1.8-.9 3.3-2 4.3L14.1 6z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-display text-4xl text-primary mb-3">{item.t}</h3>
                  <p className="text-foreground/75 leading-relaxed">{item.d}</p>

                  {/* Decorative separator */}
                  <div className="h-px w-8 bg-primary/30 my-5" />

                  {/* Scripture — always visible, editorial italic serif */}
                  <p
                    className="text-sm leading-relaxed text-foreground/60"
                    style={{ fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {item.verse}
                  </p>

                  {/* Animated underline accent */}
                  <div className="mt-6 h-0.5 w-10 bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-16 text-center">
            <Link
              to="/milano"
              className="inline-flex items-center gap-2 font-display text-xl md:text-2xl text-primary hover:gap-4 transition-all"
            >
              Vieni a trovarci questa domenica
              <span className="inline-block animate-float">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function CityCard({
  to,
  image,
  name,
  tagline,
  description,
}: {
  to: "/milano" | "/bologna";
  image: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[5/6]"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">{tagline}</p>
        <h3 className="font-display text-5xl md:text-6xl">{name}</h3>
        <p className="mt-4 max-w-md text-white/85 leading-relaxed">{description}</p>
        <span className="mt-6 inline-flex items-center text-sm font-medium">
          Visita la chiesa di {name}
          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

function SmallCityCard({
  to,
  image,
  name,
  description,
}: {
  to: "/napoli" | "/sicilia";
  image: string;
  name: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl aspect-[16/7]"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 text-white">
        <h3 className="font-display text-3xl">{name}</h3>
        <p className="mt-1 max-w-xs text-sm text-white/80">{description}</p>
      </div>
    </Link>
  );
}

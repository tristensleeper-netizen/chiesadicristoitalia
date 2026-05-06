import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { useSlotImage } from "@/lib/use-slot-image";
import heroItalia from "@/assets/hero-italia.jpg";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";
import heroNapoli from "@/assets/hero-napoli.jpg";
import heroSicilia from "@/assets/hero-sicilia.jpg";
import sunsetWarm from "@/assets/sunset-warm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo in Italia — Milano · Bologna · Napoli · Palermo" },
      {
        name: "description",
        content:
          "Una famiglia spirituale che si incontra a Milano, Bologna, Napoli e Palermo. Trova la chiesa più vicina e vieni a trovarci questa domenica.",
      },
      { property: "og:title", content: "Chiesa di Cristo in Italia" },
      {
        property: "og:description",
        content:
          "Trova la nostra chiesa a Milano, Bologna, Napoli o Palermo. Tutti sono benvenuti.",
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
        title={<>Una famiglia<br />che ti aspetta.</>}
        subtitle="Da Milano a Bologna, da Napoli a Palermo — comunità di persone normali che cercano insieme di vivere come Gesù."
        primaryCta={{ to: "/milano", label: "Trova la chiesa di Milano" }}
        secondaryCta={{ to: "/bologna", label: "Trova la chiesa di Bologna" }}
      />

      {/* Scripture on warm sunset backdrop */}
      <section className="relative overflow-hidden">
        <img
          src={sunsetWarm}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(6px) saturate(1.05)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--background) 10%, transparent) 0%, color-mix(in oklab, var(--background) 0%, transparent) 40%, color-mix(in oklab, var(--background) 95%, transparent) 100%)",
          }}
        />
        <div className="relative container-prose py-28 md:py-36 text-center">
          <figure className="max-w-2xl mx-auto text-center">
            <blockquote
              className="font-display italic text-2xl md:text-3xl leading-relaxed"
              style={{ color: "oklch(0.99 0.01 80)", textShadow: "0 2px 24px rgba(40,15,5,0.55)" }}
            >
              «E io ho fatto loro conoscere il tuo nome e lo farò conoscere ancora, affinché l'amore, del quale tu mi hai amato, sia in loro e io in loro»
            </blockquote>
            <figcaption
              className="mt-5 text-center font-display italic text-2xl md:text-3xl leading-relaxed lowercase"
              style={{ color: "oklch(0.99 0.01 80)", fontVariant: "small-caps", textShadow: "0 2px 24px rgba(40,15,5,0.55)" }}
            >
              Vangelo secondo Giovanni 17:26
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Welcome — soft cream wash, smooth transition */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), linear-gradient(180deg, var(--background), var(--primary-soft))",
          }}
        />
        <div className="container-prose py-24 md:py-32 text-center">
          <h2
            className="font-display text-foreground max-w-3xl mx-auto leading-tight"
            style={{ marginBottom: "1.5cm", fontSize: "calc(2.25rem - 1mm)", fontWeight: 400 }}
          >
            Gesù, un uomo semplice con un piano semplice: far conoscere{" "}
            <em className="italic font-bold text-foreground">Dio e il suo amore</em>.
          </h2>
          <p className="eyebrow text-center mb-5">Benvenuti</p>
          <p className="max-w-2xl mx-auto text-foreground/80 leading-relaxed">
            Siamo cristiani, persone semplici che vogliono seguire le orme di Cristo, leggendo la Bibbia e vivendola ogni giorno. Crediamo nella potenza della preghiera e nelle amicizie sincere che ci avvicinano a Dio. Se sei in Italia e stai cercando una famiglia spirituale, un posto dove sentirti a casa, la porta è aperta questa domenica oppure quando vuoi tu!
          </p>
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
                verse: "«La tua parola è una lampada al mio piede.» — Salmo 119:105",
              },
              {
                t: "Comunità",
                d: "Amicizie profonde, sincere e quotidiane.",
                icon: "people",
                verse: "«Perseveravano nella comunione fraterna.» — Atti 2:42",
              },
              {
                t: "Missione",
                d: "Portare speranza a chi ancora non la conosce.",
                icon: "→",
                verse: "«Andate e fate discepoli.» — Matteo 28:19",
              },
            ].map((item, i) => (
              <div
                key={item.t}
                className="group relative overflow-hidden rounded-3xl bg-card p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default border border-border/50"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Animated gradient orb on hover */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {item.icon === "book" ? (
                      <svg
                        aria-hidden="true"
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                        <path d="M8 7h7" />
                        <path d="M8 11h5" />
                      </svg>
                    ) : item.icon === "people" ? (
                      <svg
                        aria-hidden="true"
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <h3 className="font-display text-4xl text-primary mb-3">{item.t}</h3>
                  <p className="text-foreground/75 leading-relaxed mb-5">{item.d}</p>

                  {/* Verse — slides in on hover */}
                  <div className="overflow-hidden">
                    <p className="text-sm italic text-muted-foreground translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {item.verse}
                    </p>
                  </div>

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

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { useSlotImage } from "@/lib/use-slot-image";
import heroItalia from "@/assets/hero-italia.jpg";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";
import heroNapoli from "@/assets/hero-napoli.jpg";
import heroSicilia from "@/assets/hero-sicilia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo in Italia — Milano · Bologna · Napoli · Sicilia" },
      {
        name: "description",
        content:
          "Una famiglia spirituale che si incontra a Milano, Bologna, Napoli e in Sicilia. Trova la chiesa più vicina e vieni a trovarci questa domenica.",
      },
      { property: "og:title", content: "Chiesa di Cristo in Italia" },
      {
        property: "og:description",
        content:
          "Trova la nostra chiesa a Milano, Bologna, Napoli o in Sicilia. Tutti sono benvenuti.",
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
        subtitle="Da Milano a Bologna, da Napoli alla Sicilia — comunità di persone normali che cercano insieme di vivere come Gesù."
        primaryCta={{ to: "/milano", label: "Trova la chiesa di Milano" }}
        secondaryCta={{ to: "/bologna", label: "Trova la chiesa di Bologna" }}
      />

      {/* Intro band */}
      <section className="container-prose py-24 md:py-32 text-center">
        <p className="eyebrow mb-6">Benvenuti</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground max-w-3xl mx-auto leading-tight">
          Gesù era un uomo semplice con un piano semplice per far conoscere Dio.
        </h2>
        <p className="mt-8 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          Siamo una chiesa non tradizionale e non denominazionale, radicata nella
          Bibbia e mossa da amicizie sincere. Ovunque tu sia in Italia, vogliamo
          incontrarti — di persona, per un caffè, o questa domenica.
        </p>
      </section>

      {/* City selector */}
      <section className="container-prose pb-16">
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
            description="Sotto i portici della dotta. Funzione la domenica alle 11:00."
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
            name="Sicilia"
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
                icon: "👥",
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
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
  return (
    <>
      <PageHero
        image={heroItalia}
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
            image={heroMilano}
            name="Milano"
            tagline="Chiesa di Cristo di Milano"
            description="Ci troviamo nel cuore di Milano. Funzione la domenica alle 10:30."
            accent="from-emerald-900/40 to-emerald-950/80"
          />
          <CityCard
            to="/bologna"
            image={heroBologna}
            name="Bologna"
            tagline="Chiesa di Cristo di Bologna"
            description="Sotto i portici della dotta. Funzione la domenica alle 11:00."
            accent="from-red-900/40 to-red-950/80"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <SmallCityCard
            to="/napoli"
            image={heroNapoli}
            name="Napoli"
            description="Una piccola comunità che si incontra in casa. Scrivici per visitarci."
          />
          <SmallCityCard
            to="/sicilia"
            image={heroSicilia}
            name="Sicilia"
            description="Una piccola comunità in casa. Saremmo felici di conoscerti."
          />
        </div>
      </section>

      {/* Beliefs strip */}
      <section className="bg-primary-soft mt-16">
        <div className="container-prose py-24 grid gap-12 md:grid-cols-3 text-center">
          {[
            { t: "Bibbia", d: "La Parola di Dio guida ogni cosa che facciamo." },
            { t: "Comunità", d: "Amicizie profonde, sincere e quotidiane." },
            { t: "Missione", d: "Portare speranza a chi ancora non la conosce." },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="font-display text-3xl text-primary">{item.t}</h3>
              <p className="mt-3 text-foreground/75 leading-relaxed">{item.d}</p>
            </div>
          ))}
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

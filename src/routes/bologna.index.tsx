import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CityInfoBlock } from "@/components/city-info-block";
import { CityLatest } from "@/components/city-latest";
import { InstagramFeed } from "@/components/instagram-feed";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ScriptureMarquee } from "@/components/scripture-marquee";
import { PhotoMarquee } from "@/components/photo-marquee";
import { EventsRotator } from "@/components/events-rotator";
import heroBologna from "@/assets/hero-bologna.jpg";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import heroItalia from "@/assets/hero-italia.jpg";

const BOLOGNA_EVENTS = [
  {
    date: "Dom 27",
    time: "11:00",
    title: "Funzione domenicale",
    blurb: "Sotto i portici di Via dell'Indipendenza — adorazione, comunione e una Parola viva per la settimana.",
    tag: "Settimanale",
  },
  {
    date: "Gio 01",
    time: "19:30",
    title: "Studio biblico universitari",
    blurb: "Per studenti dell'Alma Mater. Pizza, domande, e il Vangelo di Giovanni capitolo per capitolo.",
    tag: "Studenti",
  },
  {
    date: "Sab 03",
    time: "16:00",
    title: "Pomeriggio di servizio in città",
    blurb: "Distribuzione di pasti caldi e ascolto, in collaborazione con realtà locali. Iscriviti via email.",
    tag: "Servizio",
  },
];

const BOLOGNA_PHOTOS = [
  { src: heroBologna, alt: "Bologna sotto i portici" },
  { src: worship, alt: "Comunità in adorazione" },
  { src: bibleStudy, alt: "Studio biblico" },
  { src: heroItalia, alt: "Comunità italiana" },
];

export const Route = createFileRoute("/bologna/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Bologna — Funzione domenicale e comunità" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Bologna è una comunità accogliente nel centro storico. Funzione domenicale alle 11:00. Vieni a trovarci questa domenica.",
      },
      { property: "og:title", content: "Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content:
          "Comunità cristiana nel cuore di Bologna. Domenica 11:00. Tutti sono benvenuti.",
      },
      { property: "og:image", content: heroBologna },
      { name: "twitter:image", content: heroBologna },
    ],
  }),
  component: BolognaHome,
});

function BolognaHome() {
  return (
    <>
      <PageHero
        image={heroBologna}
        eyebrow="Chiesa di Cristo"
        title={<>Bologna.</>}
        subtitle="Sotto i portici della dotta — una comunità accogliente che cammina con Dio e con te."
        primaryCta={{ to: "/bologna/visita", label: "Vieni a trovarci" }}
        secondaryCta={{ to: "/bologna/contatti", label: "Scrivici" }}
        align="left"
      />

      <CityInfoBlock
        city="Bologna"
        address="Via dell'Indipendenza 67"
        cap="40121"
        serviceTime="Domenica · 11:00"
        mapsUrl="https://maps.google.com/?q=Bologna+Italy"
      />

      {/* Animated events rotator */}
      <section className="container-prose pt-16 md:pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Cosa succede</p>
            <h2 className="font-display text-3xl md:text-4xl">Questa settimana a Bologna</h2>
          </div>
          <Link to="/bologna/eventi" className="hidden md:inline text-sm font-medium text-primary hover:underline">
            Calendario completo →
          </Link>
        </div>
        <EventsRotator events={BOLOGNA_EVENTS} cityHref="/bologna/eventi" />
      </section>

      <div className="mt-16">
        <ScriptureMarquee reverse />
      </div>

      <section className="container-prose py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
        <img
          src={worship}
          alt="Comunità in adorazione a Bologna"
          loading="lazy"
          className="rounded-3xl object-cover aspect-[4/5] w-full md:order-last"
        />
        <div>
          <p className="eyebrow mb-5">Benvenuti</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Una chiesa per la dotta — e per chiunque cerca.
          </h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            La Chiesa di Cristo di Bologna è una comunità di studenti,
            professionisti e famiglie che desidera vivere la fede in modo
            autentico. Studiamo la Bibbia insieme, condividiamo la vita e
            cerchiamo di portare luce nella nostra città.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/bologna/chi-siamo" className="btn-primary">Chi siamo</Link>
            <Link to="/bologna/cosa-crediamo" className="btn-outline">Cosa crediamo</Link>
          </div>
        </div>
      </section>

      <section className="container-prose py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Pillar
            title="Funzione domenicale"
            text="Ogni domenica alle 11:00. Adorazione, comunione e un messaggio dalla Parola di Dio."
            cta={{ to: "/bologna/visita", label: "Cosa aspettarsi" }}
          />
          <Pillar
            title="Studi biblici"
            text="Studi su misura per te, in italiano o in inglese. Senza giudizio, con tante domande benvenute."
            cta={{ to: "/bologna/contatti", label: "Inizia uno studio" }}
          />
          <Pillar
            title="Vita di comunità"
            text="Cene, gite, eventi per studenti universitari e famiglie. La fede vissuta insieme."
            cta={{ to: "/bologna/eventi", label: "Prossimi eventi" }}
          />
        </div>
      </section>

      {/* Photo galleries — moving */}
      <section className="py-16 md:py-20 space-y-6">
        <div className="container-prose mb-2">
          <p className="eyebrow mb-2">La nostra famiglia</p>
          <h2 className="font-display text-3xl md:text-4xl">Volti, momenti, vita insieme.</h2>
        </div>
        <PhotoMarquee images={BOLOGNA_PHOTOS} />
        <PhotoMarquee images={[...BOLOGNA_PHOTOS].reverse()} reverse speed="slow" />
      </section>

      <section className="relative h-[60vh] overflow-hidden">
        <img src={bibleStudy} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="container-prose relative z-10 h-full flex flex-col justify-center text-center text-white">
          <p className="eyebrow text-white/80 mb-4">Una promessa</p>
          <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
            "Cercate prima il regno di Dio e la Sua giustizia."
          </h2>
          <p className="mt-6 text-white/80">— Matteo 6:33</p>
        </div>
      </section>

      <CityLatest cityTag="bologna" cityName="Bologna" />

      <InstagramFeed handle="chiesadicristobologna" city="Bologna" />

      <section className="bg-card border-y border-border">
        <div className="container-narrow py-20 text-center">
          <p className="eyebrow mb-4">Resta in contatto</p>
          <h2 className="font-display text-3xl md:text-4xl mb-4">Una Parola alla settimana, nella tua casella.</h2>
          <p className="text-foreground/70 mb-8">
            Devozionale settimanale, eventi e nuove risorse — niente spam.
          </p>
          <NewsletterSignup cityTag="bologna" source="bologna-home" />
        </div>
      </section>
    </>
  );
}

function Pillar({ title, text, cta }: { title: string; text: string; cta: { to: string; label: string } }) {
  return (
    <div className="border-t border-border pt-8">
      <h3 className="font-display text-2xl text-primary">{title}</h3>
      <p className="mt-3 text-foreground/75 leading-relaxed">{text}</p>
      <Link to={cta.to} className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
        {cta.label} →
      </Link>
    </div>
  );
}

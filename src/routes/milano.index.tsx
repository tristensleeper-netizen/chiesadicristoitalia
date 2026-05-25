import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CityInfoBlock } from "@/components/city-info-block";
import { CityLatest } from "@/components/city-latest";
import { ScriptureMarquee } from "@/components/scripture-marquee";
import { PhotoMarquee } from "@/components/photo-marquee";
import { EventsPopup } from "@/components/events-popup";
import { EventsWeekCalendar } from "@/components/events-week-calendar";
import { VideoFeature } from "@/components/video-feature";
import { useCityEvents, useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";

import heroMilano from "@/assets/hero-milano.jpg";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import heroItalia from "@/assets/hero-italia.jpg";
import family2 from "@/assets/family-2.jpg";
import family5 from "@/assets/family-5.jpg";
import family6 from "@/assets/family-6.jpg";
import family8 from "@/assets/family-8.jpg";
import family9 from "@/assets/family-9.jpg";
import family10 from "@/assets/family-10.jpg";
import family11 from "@/assets/family-11.jpg";

const MILANO_EVENTS = [
  {
    date: "Dom 27",
    time: "10:30",
    title: "Funzione domenicale",
    blurb: "Adorazione, comunione e un messaggio dalla Bibbia. Tutti benvenuti — vieni come sei.",
    tag: "Settimanale",
  },
  {
    date: "Mer 30",
    time: "20:00",
    title: "Gruppo di quartiere — Porta Romana",
    blurb: "Cena condivisa e una discussione sul Vangelo di Marco. Famiglie e single benvenuti.",
    tag: "Piccolo gruppo",
  },
  {
    date: "Sab 03",
    time: "18:30",
    title: "Serata per giovani professionisti",
    blurb: "Aperitivo, riflessione e amicizia. Per chi vive e lavora a Milano sotto i 35.",
    tag: "Speciale",
  },
];

const MILANO_PHOTOS = [
  { src: worship, alt: "Adorazione domenicale" },
  { src: bibleStudy, alt: "Studio biblico" },
  { src: heroMilano, alt: "Milano" },
  { src: heroItalia, alt: "Comunità italiana" },
];

const milanoJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Chiesa di Cristo di Milano",
  "alternateName": "Church of Christ Milan",
  "url": "https://chiesadicristoitalia.it/milano",
  "description": "Una chiesa cristiana basata sulla Bibbia nel cuore di Milano. Ci incontriamo ogni domenica alle 10:30 in Corso di Porta Vigentina 15a. Non denominazionale, autonoma, fondata esclusivamente sulle Scritture.",
  "image": "https://chiesadicristoitalia.it/og-milano.jpg",
  "email": "info@chiesadicristoitalia.it",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Corso di Porta Vigentina 15a",
    "addressLocality": "Milano",
    "postalCode": "20122",
    "addressRegion": "MI",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.4528,
    "longitude": 9.1909
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:30",
      "closes": "12:30"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/chiesadicristodimilano",
    "https://www.youtube.com/@ChiesadiCristoMilano"
  ],
  "parentOrganization": {
    "@type": "Organization",
    "name": "Chiesa di Cristo in Italia",
    "url": "https://chiesadicristoitalia.it"
  }
};

export const Route = createFileRoute("/milano/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Milano — Funzione domenicale" },
      {
        name: "description",
        content:
          "Chiesa di Cristo di Milano: comunità nel cuore della città. Funzione domenicale alle 10:30 in Corso di Porta Vigentina 15a.",
      },
      { property: "og:title", content: "Chiesa di Cristo di Milano" },
      {
        property: "og:description",
        content: "Comunità cristiana nel cuore di Milano. Domenica 10:30, Corso di Porta Vigentina 15a.",
      },
      { property: "og:url", content: "https://chiesadicristoitalia.it/milano" },
      { property: "og:image", content: heroMilano },
      { name: "twitter:image", content: heroMilano },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/milano" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(milanoJsonLd),
      },
    ],
  }),
  component: MilanoHome,
});

function MilanoHome() {
  const events = useCityEvents("milano", MILANO_EVENTS);
  const heroImage = useActiveHero("milano", heroMilano);
  const welcomeImg = useSlotImage("milano.welcome", worship);
  const bibleBandImg = useSlotImage("milano.bibleband", bibleStudy);
  const photo1 = useSlotImage("milano.photo1", worship);
  const photo2 = useSlotImage("milano.photo2", bibleStudy);
  const photo3 = useSlotImage("milano.photo3", heroMilano);
  const photo4 = useSlotImage("milano.photo4", heroItalia);
  const cityPhotos = [
    { src: photo1, alt: "Adorazione domenicale" },
    { src: photo2, alt: "Studio biblico" },
    { src: family2, alt: "Celebrazione di matrimonio" },
    { src: photo3, alt: "Milano" },
    { src: photo4, alt: "Comunità italiana" },
    { src: family5, alt: "Ritiro in montagna" },
    { src: family6, alt: "Pranzo insieme" },
    { src: family8, alt: "Donne in ritiro" },
    { src: family9, alt: "Amicizia in natura" },
    { src: family10, alt: "Momento di comunità" },
    { src: family11, alt: "Mamme alla chiesa di Milano" },
  ];
  return (
    <>
      <PageHero
        slot="milano.hero"
        image={heroImage}
        eyebrow="Chiesa di Cristo"
        title={<>Milano</>}
        subtitle="Una chiesa nel cuore della città. Persone, amicizie vere, una fede che cambia la vita."
        primaryCta={{ to: "/milano/visita", label: "Vieni a trovarci" }}
        secondaryCta={{ to: "/milano/contatti", label: "Scrivici" }}
        align="left"
      />

      <CityInfoBlock
        city="Milano"
        address="Corso di Porta Vigentina 15a"
        cap="20122"
        serviceTime="Domenica · 10:30"
        mapsUrl="https://maps.app.goo.gl/VvkjBp6rWkm9A4aa9"
      />

      {/* Floating bottom-right popup */}
      <EventsPopup events={events} cityHref="/milano/eventi" cityName="Milano" />

      {/* Video — prominent click-through, placed high for visibility */}
      <div className="mt-8 md:mt-12">
        <VideoFeature
          eyebrow="Conoscici"
          title="Due minuti per scoprire la Chiesa di Cristo di Milano."
          description="Volti, parole e momenti di una comunità che si ritrova ogni domenica nel cuore della città."
          videos={[
            {
              videoUrl: "https://youtu.be/bOobMSS-DuI?si=wZL0h5VQa0gHzEsA",
              title: "Due minuti per scoprire la Chiesa di Cristo di Milano.",
              description: "Volti, parole e momenti di una comunità che si ritrova ogni domenica nel cuore della città.",
            },
            // Aggiungi altri video qui — ne verrà mostrato uno diverso ogni settimana.
            // {
            //   videoUrl: "https://youtu.be/...",
            //   title: "Titolo del secondo video",
            //   description: "Breve descrizione.",
            // },
          ]}
        />
      </div>

      {/* Weekly calendar */}
      <section className="container-prose pt-12 md:pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Cosa succede</p>
            <h2 className="font-display text-3xl md:text-4xl">Questa settimana a Milano</h2>
          </div>
          <Link to="/milano/eventi" className="hidden md:inline text-sm font-medium text-primary hover:underline">
            Calendario completo →
          </Link>
        </div>
        <EventsWeekCalendar city="milano" cityHref="/milano/eventi" />
      </section>

      <div className="mt-16">
        <ScriptureMarquee />
      </div>

      {/* Welcome */}
      <section className="container-prose py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/40" />
            <p className="eyebrow !mb-0">Benvenuti</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">Siamo contenti che siate qui.</h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            La Chiesa di Cristo di Milano arde nel far conoscere Dio e nel diffondere una luce intorno a sé, seguendo
            l'esempio di Gesù nel fare il bene. Ci incontriamo la domenica per la funzione e durante la settimana in
            piccoli gruppi nei quartieri della città.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/milano/chi-siamo" className="btn-primary">
              Chi siamo
            </Link>
            <Link to="/milano/cosa-crediamo" className="btn-outline">
              Cosa crediamo
            </Link>
          </div>
        </div>
        <img
          src={welcomeImg}
          alt="Comunità in adorazione"
          loading="lazy"
          className="rounded-3xl object-cover object-right aspect-[4/5] w-full"
        />
      </section>



      {/* Three pillars */}
      <section className="container-prose py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Pillar
            title="Funzione domenicale"
            text="Ogni domenica alle 10:30 ci ritroviamo per adorare insieme, prendere la comunione e ascoltare un messaggio dalla Bibbia."
            cta={{ to: "/milano/visita", label: "Cosa aspettarsi" }}
          />
          <Pillar
            title="Studi biblici"
            text="Studi personalizzati, uno-a-uno o in piccoli gruppi, per scoprire chi è davvero Gesù — al tuo ritmo, senza pressione."
            cta={{ to: "/milano/contatti", label: "Inizia uno studio" }}
          />
          <Pillar
            title="Gruppi di quartiere"
            text="Connettiti con i membri della tua zona di Milano per discussioni profonde su Dio e sulla vita quotidiana."
            cta={{ to: "/milano/eventi", label: "Trova un gruppo" }}
          />
        </div>
      </section>

      {/* Photo galleries — moving */}
      <section className="py-16 md:py-20 space-y-6">
        <div className="container-prose mb-2">
          <p className="eyebrow mb-2">La nostra famiglia</p>
          <h2 className="font-display text-3xl md:text-4xl">Volti, momenti, vita insieme.</h2>
        </div>
        <PhotoMarquee images={cityPhotos} />
        <PhotoMarquee images={[...cityPhotos].reverse()} reverse speed="slow" />
      </section>

      {/* Bible study image band */}
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <img src={bibleBandImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/85" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_55%)]" />
        <div className="container-prose relative z-10 h-full flex flex-col justify-center text-center text-white">
          <span aria-hidden className="pointer-events-none mx-auto mb-2 font-display text-[6rem] md:text-[8rem] leading-none text-white/15 select-none">“</span>
          <div className="inline-flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-white/40" />
            <p className="eyebrow text-white/85 !mb-0">Una promessa</p>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h2 className="font-display italic text-3xl md:text-5xl lg:text-[3.5rem] max-w-3xl mx-auto leading-[1.2] text-balance font-normal">
            Venite a me, voi tutti che siete affaticati e oppressi, e io vi darò riposo.
          </h2>
          <p className="mt-8 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-white/75 mx-auto">
            <span className="h-px w-6 bg-white/40" />
            Matteo 11:28
            <span className="h-px w-6 bg-white/40" />
          </p>
        </div>
      </section>



      {/* Lettura Devozionale */}
      <section className="container-prose py-16 md:py-24">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Crescita spirituale</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">Lettura devozionale del giorno.</h2>
        </div>
        <div className="relative mx-auto max-w-5xl">
          {/* Soft glow halo for highlight */}
          <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-[#f0c98a]/25 to-primary/10 blur-2xl opacity-70" />
          <div className="relative rounded-3xl bg-gradient-to-br from-[#fbf3e6] to-[#f5e6d0] border border-[rgba(107,76,53,0.18)] p-6 md:p-10 shadow-[0_20px_60px_-20px_rgba(107,76,53,0.35)]">
            <div className="space-y-5 max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 border border-[rgba(107,76,53,0.18)] shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
                    <line x1="12" y1="7" x2="12" y2="14"/><line x1="9" y1="10" x2="15" y2="10"/>
                  </svg>
                </div>
                <p className="eyebrow text-primary/80">Studio di Isaia</p>
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-primary leading-tight">Isaia — Il Signore è salvezza</h3>
              <p className="text-foreground/75 leading-relaxed text-sm md:text-base">
                Un percorso devozionale attraverso i 66 capitoli di Isaia: 66 giorni, un capitolo al giorno. Contesto, domande sul testo, domande per noi e ulteriori note per ogni capitolo.
              </p>
              <div className="h-px w-full bg-[rgba(107,76,53,0.15)]" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Scrittura guida</p>
                <p className="font-serif italic text-foreground/85 text-lg leading-relaxed">
                  «Non temere, perché io sono con te; non ti scoraggiare, perché io sono il tuo Dio.»
                </p>
                <p className="text-sm text-muted-foreground mt-2">— Isaia 41:10</p>
              </div>
              <div className="pt-2">
                <Link to="/milano/devozionale" className="btn-primary inline-flex items-center gap-2">
                  Apri lo studio <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CityLatest cityTag="milano" cityName="Milano" />
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


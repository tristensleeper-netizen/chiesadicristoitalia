import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CityInfoBlock } from "@/components/city-info-block";
import { CityLatest } from "@/components/city-latest";
import { ScriptureMarquee } from "@/components/scripture-marquee";
import { PhotoMarquee } from "@/components/photo-marquee";
import { EventsPopup } from "@/components/events-popup";
import { EventsWeekCalendar } from "@/components/events-week-calendar";
import { useCityEvents, useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import heroMilano from "@/assets/hero-milano.jpg";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import heroItalia from "@/assets/hero-italia.jpg";

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

export const Route = createFileRoute("/milano/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Milano — Funzione domenicale e comunità" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Milano è una comunità nel cuore della città. Funzione domenicale alle 10:30 in Corso di Porta Vigentina 15a. Vieni a trovarci.",
      },
      { property: "og:title", content: "Chiesa di Cristo di Milano" },
      {
        property: "og:description",
        content: "Comunità cristiana nel cuore di Milano. Domenica 10:30, Corso di Porta Vigentina 15a.",
      },
      { property: "og:image", content: heroMilano },
      { name: "twitter:image", content: heroMilano },
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
    { src: photo3, alt: "Milano" },
    { src: photo4, alt: "Comunità italiana" },
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

      {/* Weekly calendar */}
      <section className="container-prose pt-4 md:pt-8">
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
          <p className="eyebrow mb-5">Benvenuti</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">Siamo contenti che siate qui.</h2>
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
      <section className="relative h-[60vh] overflow-hidden">
        <img src={bibleBandImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="container-prose relative z-10 h-full flex flex-col justify-center text-center text-white">
          <p className="eyebrow text-white/80 mb-4">Una promessa</p>
          <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
            "Venite a me, voi tutti che siete affaticati e oppressi, e io vi darò riposo."
          </h2>
          <p className="mt-6 text-white/80">— Matteo 11:28</p>
        </div>
      </section>

      {/* Lettura Devozionale */}
      <section className="container-prose py-16 md:py-24">
        <div className="mb-8">
          <p className="eyebrow mb-3">Crescita spirituale</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">Lettura devozionale del giorno.</h2>
        </div>
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 border border-primary/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
                <line x1="12" y1="7" x2="12" y2="14"/><line x1="9" y1="10" x2="15" y2="10"/>
              </svg>
            </div>
            <p className="eyebrow text-primary/80">Studio di Isaia</p>
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-primary">Isaia — Il Signore è salvezza</h3>
          <p className="text-foreground/75 leading-relaxed">
            Un piano devozionale che ti guida attraverso il libro di Isaia, giorno per giorno. Una scrittura, un riassunto, domande di applicazione e una preghiera per iniziare bene la giornata.
          </p>
          <div className="h-px w-full bg-border" />
          <div className="rounded-xl border border-border bg-background/40 px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Scrittura di oggi</p>
            <p className="font-serif italic text-foreground/80 text-lg leading-relaxed">
              «Non temere, perché io sono con te; non ti scoraggiare, perché io sono il tuo Dio.»
            </p>
            <p className="text-sm text-muted-foreground mt-2">— Isaia 41:10</p>
          </div>
          <div className="pt-2">
            <Link to="/milano/devozionale" className="btn-primary inline-flex items-center gap-2">
              Lettura completa <span aria-hidden>→</span>
            </Link>
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

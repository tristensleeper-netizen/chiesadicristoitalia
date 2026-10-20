import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SpecialServiceNotice } from "@/components/special-service-notice";

import { ScriptureMarquee } from "@/components/scripture-marquee";
import { PhotoMarquee } from "@/components/photo-marquee";
import { useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import { Sprout, HandHeart, Users, CalendarClock } from "lucide-react";
import type { ReactNode } from "react";
import heroBologna from "@/assets/hero-bologna.jpg";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import heroItalia from "@/assets/hero-italia.jpg";

const bolognaJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Chiesa di Cristo di Bologna",
  "alternateName": "Church of Christ Bologna",
  "url": "https://chiesadicristoitalia.it/bologna",
  "description": "Una comunità cristiana a Bologna, senza una sede. Il luogo degli incontri è ancora da confermare: contattaci per partecipare.",
  "email": "info@chiesadicristoitalia.it",
  "areaServed": {
    "@type": "City",
    "name": "Bologna",
    "containedInPlace": {
      "@type": "State",
      "name": "Emilia-Romagna"
    }
  },
  "sameAs": [
    "https://www.instagram.com/chiesadicristodibologna"
  ],
  "parentOrganization": {
    "@type": "Organization",
    "name": "Chiesa di Cristo in Italia",
    "url": "https://chiesadicristoitalia.it"
  }
};

export const Route = createFileRoute("/bologna/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Bologna — Camminiamo insieme" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Bologna: preghiera, Bibbia e lode. Non abbiamo una sede; il luogo degli incontri è ancora da confermare. Scrivici per partecipare.",
      },
      { property: "og:title", content: "Chiesa di Cristo di Bologna — Camminiamo insieme" },
      {
        property: "og:description",
        content:
          "Una famiglia spirituale a Bologna. Il luogo degli incontri è ancora da confermare: scrivici prima di venire.",
      },
      { property: "og:url", content: "https://chiesadicristoitalia.it/bologna" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/bologna" }],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(bolognaJsonLd),
      },
    ],
  }),
  component: BolognaHome,
});

const LAUNCH_LABEL = "4 Ottobre 2026";

function BolognaHome() {
  const heroImage = useActiveHero("bologna", heroBologna);
  const welcomeImg = useSlotImage("bologna.welcome", worship);
  const bibleBandImg = useSlotImage("bologna.bibleband", bibleStudy);
  const photo1 = useSlotImage("bologna.photo1", heroBologna);
  const photo2 = useSlotImage("bologna.photo2", worship);
  const photo3 = useSlotImage("bologna.photo3", bibleStudy);
  const photo4 = useSlotImage("bologna.photo4", heroItalia);
  const cityPhotos = [
    { src: photo1, alt: "Bologna" },
    { src: photo2, alt: "Adorazione" },
    { src: photo3, alt: "Studio biblico" },
    { src: photo4, alt: "Comunità italiana" },
  ];

  return (
    <>
      <SpecialServiceNotice context="bologna" />
      <PageHero
        slot="bologna.hero"
        image={heroImage}
        eyebrow="Una comunità cristiana · Bologna"
        title={<>Un nuovo<br />cammino a Bologna.</>}
        subtitle="Una famiglia spirituale che cresce nella fede e nell’amore. Non abbiamo una sede e il luogo dei nostri incontri è ancora da confermare: scrivici per camminare con noi."
        primaryCta={{ to: "/bologna/contatti", label: "Cammina con noi" }}
        secondaryCta={{ to: "/milano", label: "Visita Milano" }}
        align="left"
      />

      {/* Announcement: inaugurazione + sede */}
      <section className="container-prose pt-16 md:pt-20">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 text-primary">
            <CalendarClock className="h-5 w-5" strokeWidth={1.75} />
            <p className="eyebrow text-primary">Incontriamoci a Bologna</p>
          </div>
          <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight">
            Il luogo degli incontri è da confermare.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed max-w-2xl">
            Non abbiamo una sede. Scrivici prima di venire: ti daremo
            i dettagli del prossimo incontro. Sei il benvenuto.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/75">
            <span>Preghiera, riflessione dalla Bibbia e lode</span>
            <span>Atmosfera amichevole e informale</span>
            <span>Aperto a tutti</span>
            <span>In italiano, con traduzione in inglese</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/bologna/contatti" className="btn-outline">
              Cammina con noi
            </Link>
            <a
              href="https://wa.me/393477519426"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp · +39 347 751 9426
            </a>
          </div>
        </div>
      </section>

      <div className="mt-16">
        <ScriptureMarquee reverse />
      </div>

      {/* What we're doing now */}
      <section className="container-prose py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
        <img
          src={welcomeImg}
          alt="Comunità in preghiera per Bologna"
          loading="lazy"
          className="rounded-3xl object-cover aspect-[4/5] w-full md:order-last"
        />
        <div>
          <p className="eyebrow mb-5">La vita della comunità</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Crescere insieme, un passo alla volta.
          </h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            Dalla prima funzione del {LAUNCH_LABEL} ci dedichiamo a tre cose:
            pregare per Bologna e per chi la abita, costruire insieme una
            comunità unita dall'amore, e offrire studi biblici personali a chi
            desidera conoscere Gesù.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/bologna/contatti" className="btn-primary">Inizia uno studio biblico</Link>
            <Link to="/bologna/cosa-crediamo" className="btn-outline">Cosa crediamo</Link>
          </div>
        </div>
      </section>

      {/* Three ways to join */}
      <section className="container-prose py-16 md:py-24">
        <div className="mb-12">
          <p className="eyebrow mb-3">Come puoi camminare con noi</p>
          <h2 className="font-display text-3xl md:text-4xl">Tre modi concreti, da subito.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <PlantCard
            icon={<HandHeart className="h-6 w-6" strokeWidth={1.75} />}
            title="Prega con noi"
            text="Aggiungi Bologna al tuo tempo di preghiera. Riceverai aggiornamenti mensili con motivi specifici per cui pregare."
            cta={{ to: "/bologna/contatti", label: "Voglio pregare" }}
          />
          <PlantCard
            icon={<Users className="h-6 w-6" strokeWidth={1.75} />}
            title="Vieni a una funzione"
            text="Preghiera, Bibbia e lode insieme. Il luogo degli incontri è ancora da confermare: scrivici per sapere dove e quando partecipare."
            cta={{ to: "/bologna/visita", label: "Informazioni sugli incontri" }}
          />
          <PlantCard
            icon={<Sprout className="h-6 w-6" strokeWidth={1.75} />}
            title="Inizia uno studio biblico"
            text="Possiamo incontrarci — di persona o online — per leggere la Bibbia insieme, al tuo ritmo."
            cta={{ to: "/bologna/contatti", label: "Studiamo insieme" }}
          />
        </div>
      </section>

      {/* Photo galleries — moving */}
      <section className="py-16 md:py-20 space-y-6">
        <div className="container-prose mb-2">
          <p className="eyebrow mb-2">Volti e momenti</p>
          <h2 className="font-display text-3xl md:text-4xl">Chi sta camminando con noi.</h2>
        </div>
        <PhotoMarquee images={cityPhotos} />
        <PhotoMarquee images={[...cityPhotos].reverse()} reverse speed="slow" />
      </section>

      {/* Promise / verse */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={bibleBandImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="container-prose relative z-10 h-full flex flex-col justify-center text-center text-white">
          <p className="eyebrow text-white/80 mb-4">Una promessa</p>
          <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
            "Io pianto, Apollo annaffia, ma Dio fa crescere."
          </h2>
          <p className="mt-6 text-white/80">— 1 Corinzi 3:6</p>
        </div>
      </section>

    </>
  );
}

function PlantCard({
  icon,
  title,
  text,
  cta,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  cta: { to: string; label: string };
}) {
  return (
    <div className="group rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-3 text-foreground/75 leading-relaxed">{text}</p>
      <Link to={cta.to} className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
        {cta.label} →
      </Link>
    </div>
  );
}

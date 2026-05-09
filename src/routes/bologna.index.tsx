import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ElegantPillar } from "@/components/elegant-pillar";

import { ScriptureMarquee } from "@/components/scripture-marquee";
import { PhotoMarquee } from "@/components/photo-marquee";
import { useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import { CalendarClock } from "lucide-react";
import heroBologna from "@/assets/hero-bologna.jpg";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import heroItalia from "@/assets/hero-italia.jpg";

export const Route = createFileRoute("/bologna/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Bologna — Chiesa in fondazione — apertura settembre 2026" },
      {
        name: "description",
        content:
          "La Chiesa di Cristo di Bologna è una chiesa in fondazione. Lancio previsto per settembre 2026. Unisciti a noi in preghiera, in uno studio biblico, o nel gruppo fondatore.",
      },
      { property: "og:title", content: "Chiesa di Cristo di Bologna — In arrivo settembre 2026" },
      {
        property: "og:description",
        content:
          "Stiamo piantando una nuova chiesa a Bologna. Resta aggiornato e cammina con noi.",
      },
      { property: "og:image", content: heroBologna },
      { name: "twitter:image", content: heroBologna },
    ],
  }),
  component: BolognaHome,
});

const LAUNCH_LABEL = "Settembre 2026";

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
      <PageHero
        slot="bologna.hero"
        image={heroImage}
        eyebrow={`Chiesa in fondazione · Lancio ${LAUNCH_LABEL}`}
        title={<>Bologna,<br />sta per nascere.</>}
        subtitle="Stiamo preparando una nuova Chiesa di Cristo nel cuore della dotta. Non abbiamo ancora una sede né funzioni regolari — ma stiamo pregando, studiando la Bibbia insieme e cercando chi vuole camminare con noi da subito."
        primaryCta={{ to: "/bologna/contatti", label: "Cammina con noi" }}
        secondaryCta={{ to: "/milano", label: "Visita Milano" }}
        align="left"
      />

      {/* Honest status banner */}
      <section className="container-prose pt-16 md:pt-20">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-primary">
            <CalendarClock className="h-5 w-5" strokeWidth={1.75} />
            <p className="eyebrow text-primary">A che punto siamo</p>
          </div>
          <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight">
            Una chiesa in fondazione, non una chiesa già aperta.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed max-w-2xl">
            Vogliamo essere onesti: a Bologna oggi non c'è ancora una funzione
            domenicale, una sede stabile o un calendario di eventi della Chiesa
            di Cristo. Quello che c'è è un piccolo gruppo che prega, sogna e si
            prepara per il lancio previsto per <strong>{LAUNCH_LABEL}</strong>.
            Se ti senti chiamato a far parte di questo inizio, c'è posto per te.
          </p>
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
          <p className="eyebrow mb-5">Cosa stiamo facendo ora</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Preparare il terreno, un passo alla volta.
          </h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            Mentre aspettiamo {LAUNCH_LABEL}, ci stiamo dedicando a tre cose:
            pregare per Bologna e per chi la abita, costruire un gruppo
            fondatore di persone che vogliono fondare la chiesa insieme, e
            offrire studi biblici personali a chi è interessato a conoscere
            Gesù — anche prima del lancio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/bologna/contatti" className="btn-primary">Inizia uno studio biblico</Link>
            <Link to="/bologna/cosa-crediamo" className="btn-outline">Cosa crediamo</Link>
          </div>
        </div>
      </section>

      {/* Three ways to join */}
      <section className="container-prose py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-3">Come puoi camminare con noi</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            Tre modi concreti, da subito.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ElegantPillar
            index={0}
            eyebrow="Preghiera"
            title="Prega con noi"
            text="Aggiungi Bologna al tuo tempo di preghiera. Riceverai aggiornamenti mensili con motivi specifici per cui pregare."
            cta={{ to: "/bologna/contatti", label: "Voglio pregare" }}
          />
          <ElegantPillar
            index={1}
            eyebrow="Gruppo fondatore"
            title="Unisciti al gruppo fondatore"
            text="Vivi a Bologna o nelle vicinanze e senti il chiamato? Stiamo cercando persone che vogliano fondare questa chiesa con noi."
            cta={{ to: "/bologna/contatti", label: "Voglio esserci" }}
          />
          <ElegantPillar
            index={2}
            eyebrow="Bibbia"
            title="Inizia uno studio biblico"
            text="Anche prima del lancio possiamo incontrarci — di persona o online — per leggere la Bibbia insieme, al tuo ritmo."
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

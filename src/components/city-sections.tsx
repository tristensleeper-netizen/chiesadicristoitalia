import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Link } from "@tanstack/react-router";
import { useCityEvents, useActiveHero } from "@/lib/use-city-events";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";

export interface CityConfig {
  name: "Milano" | "Bologna";
  hero: string;
  address: string;
  cap: string;
  serviceTime: string;
  mapsUrl: string;
  basePath: "/milano" | "/bologna";
}

export function AboutSection({ city }: { city: CityConfig }) {
  return (
    <>
      <PageHero
        image={city.hero}
        eyebrow={`Chi siamo · ${city.name}`}
        title={<>Una famiglia<br />spirituale.</>}
        subtitle={`Conosci la Chiesa di Cristo di ${city.name} — chi siamo, cosa ci muove e perché ci ritroviamo ogni domenica.`}
        height="medium"
      />
      <section className="container-narrow py-20">
        <p className="eyebrow mb-5">La nostra storia</p>
        <h2 className="font-display text-4xl mb-6">Una chiesa unita dall'amore.</h2>
        <div className="space-y-5 text-foreground/80 leading-relaxed">
          <p>
            Siamo una chiesa unita dall'amore — un amore profondo che abbraccia
            sia la nostra comunità sia chi è ancora in cerca di fede. La nostra
            visione è chiara: aspiriamo a essere un faro di luce nella vivace
            città di {city.name}, illuminando il cammino verso Cristo con
            compassione e comprensione.
          </p>
          <p>
            Con umiltà, ci dedichiamo a servire Gesù e il Suo regno. Riconosciamo
            le nostre imperfezioni, ma troviamo forza nel nostro impegno
            condiviso. Il nostro obiettivo non è solo partecipare, ma coinvolgerci
            attivamente nella vita gli uni degli altri e nella chiesa, dedicando
            le nostre vite, cuori, anime e menti alla gloria di Dio.
          </p>
        </div>
        <figure className="mt-12">
          <img src={worship} alt="Comunità riunita" loading="lazy" className="rounded-2xl object-cover w-full aspect-video" />
        </figure>
      </section>
    </>
  );
}

export function BeliefsSection({ city }: { city: CityConfig }) {
  const beliefs = [
    { t: "La Bibbia", d: "La Parola di Dio è la nostra autorità in materia di fede e di vita." },
    { t: "Gesù", d: "Crediamo che Gesù è il Figlio di Dio, morto e risorto per salvarci." },
    { t: "Il discepolato", d: "Seguire Gesù significa imparare ogni giorno a vivere come Lui." },
    { t: "La grazia", d: "Siamo salvati per grazia, attraverso la fede, non per i nostri meriti." },
    { t: "La comunità", d: "Camminare insieme è essenziale: ci incoraggiamo, correggiamo e amiamo." },
    { t: "La missione", d: "Vogliamo portare il Vangelo a chiunque, con umiltà e rispetto." },
  ];
  return (
    <>
      <PageHero
        image={bibleStudy}
        eyebrow={`Cosa crediamo · ${city.name}`}
        title={<>Una fede semplice,<br />biblica, viva.</>}
        subtitle="Ciò che crediamo nasce dalle Scritture e dà forma a come viviamo, ogni giorno."
        height="medium"
      />
      <section className="container-prose py-20 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {beliefs.map((b) => (
          <div key={b.t}>
            <h3 className="font-display text-2xl text-primary">{b.t}</h3>
            <p className="mt-3 text-foreground/75 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>
      <section className="bg-primary-soft">
        <div className="container-narrow py-20 text-center">
          <p className="eyebrow mb-4">Hai domande?</p>
          <h2 className="font-display text-4xl mb-6">Studiamo insieme la Bibbia.</h2>
          <p className="text-foreground/75 mb-8">
            Il modo migliore per scoprire chi è Gesù è leggerlo direttamente.
            Possiamo iniziare un percorso a tuo ritmo, in caffetteria, online,
            o dove preferisci.
          </p>
          <Link to={`${city.basePath}/contatti`} className="btn-primary">
            Inizia uno studio biblico
          </Link>
        </div>
      </section>
    </>
  );
}

export function VisitSection({ city }: { city: CityConfig }) {
  return (
    <>
      <PageHero
        image={city.hero}
        eyebrow={`Visita · ${city.name}`}
        title={<>Vieni a trovarci<br />questa domenica.</>}
        subtitle={`${city.serviceTime} · ${city.address}, ${city.cap} ${city.name}`}
        primaryCta={{ to: `${city.basePath}/contatti`, label: "Avvisaci che vieni" }}
        height="medium"
      />
      <section className="container-prose py-20 grid gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">Cosa aspettarsi</p>
          <h2 className="font-display text-3xl mb-6">Una funzione semplice e accogliente.</h2>
          <ul className="space-y-5 text-foreground/80 leading-relaxed">
            <li><strong className="text-primary">Arrivo.</strong> Ti accoglieremo all'ingresso. Vestiti come stai bene tu.</li>
            <li><strong className="text-primary">Adorazione.</strong> Cantiamo insieme, in italiano, con cuore.</li>
            <li><strong className="text-primary">Comunione.</strong> Condividiamo pane e vino in memoria di Gesù.</li>
            <li><strong className="text-primary">Messaggio.</strong> Un insegnamento dalla Bibbia, pratico e attuale.</li>
            <li><strong className="text-primary">Caffè.</strong> Ci fermiamo a chiacchierare. Speriamo di conoscerti.</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card p-8">
          <p className="eyebrow mb-3">Indirizzo</p>
          <p className="font-display text-2xl text-foreground">{city.address}</p>
          <p className="text-foreground/70">{city.cap} {city.name}</p>
          <p className="eyebrow mt-8 mb-3">Orario</p>
          <p className="font-display text-2xl text-foreground">{city.serviceTime}</p>
          <a
            href={city.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 btn-outline w-full"
          >
            Apri in Google Maps
          </a>
        </div>
      </section>
    </>
  );
}

export function SermonsSection({ city }: { city: CityConfig }) {
  const sermons = [
    { t: "L'amore che non delude", d: "Una serie su 1 Corinzi 13", date: "Gennaio 2025" },
    { t: "Camminare nella luce", d: "Studio su 1 Giovanni", date: "Dicembre 2024" },
    { t: "Il Sermone sul Monte", d: "Le parole di Gesù che cambiano tutto", date: "Novembre 2024" },
    { t: "Speranza in tempo di prova", d: "La lettera di Giacomo", date: "Ottobre 2024" },
  ];
  return (
    <>
      <PageHero
        image={bibleStudy}
        eyebrow={`Sermoni · ${city.name}`}
        title={<>Ascolta. Leggi.<br />Cresci.</>}
        subtitle="Predicazioni recenti dalla Chiesa di Cristo. Esplora la Bibbia al tuo ritmo."
        height="short"
      />
      <section className="container-prose py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {sermons.map((s) => (
            <article key={s.t} className="rounded-2xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <p className="eyebrow mb-3">{s.date}</p>
              <h3 className="font-display text-2xl text-foreground">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
              <button className="mt-5 text-sm font-medium text-primary hover:underline">
                Ascolta →
              </button>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-muted-foreground text-sm">
          I sermoni audio saranno presto disponibili. Iscriviti al podcast per
          essere avvisato.
        </p>
      </section>
    </>
  );
}

export function EventsSection({ city }: { city: CityConfig }) {
  const cityKey = city.name.toLowerCase() as "milano" | "bologna";
  const heroImage = useActiveHero(cityKey, city.hero);
  const fallback = [
    { date: "Ogni domenica", time: city.serviceTime, title: "Funzione domenicale", blurb: "", tag: "Settimanale" },
  ];
  const dynamic = useCityEvents(cityKey, fallback);
  return (
    <>
      <PageHero
        image={heroImage}
        eyebrow={`Eventi · ${city.name}`}
        title={<>La vita della<br />comunità.</>}
        subtitle="Funzioni, studi biblici, cene e progetti — c'è sempre qualcosa che succede."
        height="short"
      />
      <section className="container-prose py-20">
        <ul className="divide-y divide-border border-y border-border">
          {dynamic.map((e, i) => (
            <li key={`${e.title}-${i}`} className="py-6 grid gap-2 md:grid-cols-[180px_1fr_auto] items-baseline">
              <p className="eyebrow">{e.date || "—"}</p>
              <p className="font-display text-2xl text-foreground">{e.title}</p>
              <p className="text-muted-foreground">{[e.time, e.blurb].filter(Boolean).join(" · ")}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Link to={`${city.basePath}/contatti`} className="btn-primary">
            Voglio partecipare
          </Link>
        </div>
      </section>
    </>
  );
}

export function ContactSection({ city }: { city: CityConfig }) {
  return (
    <>
      <PageHero
        image={city.hero}
        eyebrow={`Contatti · ${city.name}`}
        title={<>Facci sapere<br />se verrai.</>}
        subtitle="Compila il modulo. Non vediamo l'ora di conoscerti."
        height="short"
      />
      <section className="container-prose py-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4">Scrivici</p>
          <h2 className="font-display text-3xl mb-6">Siamo qui per te.</h2>
          <p className="text-foreground/75 leading-relaxed mb-8">
            Vuoi visitarci, iniziare uno studio biblico, o semplicemente
            scambiare due parole? Compila il modulo o scrivici una email.
            Risponderemo entro 24 ore.
          </p>
          <ul className="space-y-3 text-foreground/85">
            <li><span className="eyebrow block mb-1">Email</span>info@chiesadicristoitalia.it</li>
            <li><span className="eyebrow block mb-1">Indirizzo</span>{city.address}<br />{city.cap} {city.name}</li>
            <li><span className="eyebrow block mb-1">Funzione</span>{city.serviceTime}</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <ContactForm city={city.name} defaultSubject={`Visitare la chiesa di ${city.name}`} />
        </div>
      </section>
    </>
  );
}

import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";

import { Link } from "@tanstack/react-router";
import { useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import { EventsCalendar } from "@/components/events-calendar";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import milanoFamily from "@/assets/milano-family.jpg";

export interface CityConfig {
  name: "Milano" | "Bologna";
  hero: string;
  address: string;
  cap: string;
  serviceTime: string;
  mapsUrl: string;
  basePath: "/milano" | "/bologna";
  /** True when the city is a "chiesa in fondazione" — no physical location/services yet. */
  isPlant?: boolean;
  /** When isPlant is true, a human-readable launch label like "Settembre 2026". */
  launchLabel?: string;
}

export function AboutSection({ city }: { city: CityConfig }) {
  const heroImage = useActiveHero(city.name.toLowerCase() as "milano" | "bologna", city.hero);
  return (
    <>
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
        eyebrow={city.isPlant ? `Chiesa in fondazione · ${city.name}` : `Chi siamo · ${city.name}`}
        title={city.isPlant ? <>Una nuova<br />comunità in arrivo.</> : <>Una famiglia<br />spirituale.</>}
        subtitle={
          city.isPlant
            ? `Stiamo preparando una nuova Chiesa di Cristo a ${city.name}. Lancio previsto per ${city.launchLabel ?? "presto"}.`
            : `Conosci la Chiesa di Cristo di ${city.name} — chi siamo, cosa ci muove e perché ci ritroviamo ogni domenica.`
        }
        height="medium"
      />
      <section className="container-narrow py-20">
        <p className="eyebrow mb-5">{city.isPlant ? "Il nostro sogno" : "La nostra storia"}</p>
        <h2 className="font-display text-4xl mb-6">
          {city.isPlant ? `Piantare una chiesa a ${city.name}.` : "Una chiesa unita dall'amore."}
        </h2>
        <div className="space-y-5 text-foreground/80 leading-relaxed">
          {city.isPlant ? (
            <>
              <p>
                A {city.name} non c'è ancora una Chiesa di Cristo, e questo
                ci sta a cuore. Stiamo pregando, formando un piccolo gruppo
                fondatore e preparando il terreno per lanciare una comunità
                nuova nel {city.launchLabel ?? "prossimo futuro"}.
              </p>
              <p>
                Per ora non abbiamo una sede stabile né funzioni regolari.
                Quello che possiamo offrire oggi è ascolto, preghiera, studi
                biblici personali e l'invito a camminare con noi mentre Dio
                apre la strada.
              </p>
              <p>
                Se vivi a {city.name} o nelle vicinanze e ti interessa fare
                parte di questa avventura — come membro del gruppo fondatore,
                come amico in preghiera, o semplicemente per restare aggiornato
                — scrivici. Vogliamo conoscerti.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        <figure className="mt-12">
          <img src={city.name === "Milano" ? milanoFamily : worship} alt={`Comunità di ${city.name}`} loading="lazy" className="rounded-2xl object-cover w-full aspect-video" />
        </figure>
        {city.isPlant && (
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to={`${city.basePath}/contatti`} className="btn-primary">Voglio camminare con voi</Link>
            <Link to="/milano" className="btn-outline">Visita la chiesa di Milano</Link>
          </div>
        )}
      </section>
    </>
  );
}

export function BeliefsSection({ city }: { city: CityConfig }) {
  const heroImg = useSlotImage("beliefs.hero", bibleStudy);
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
        slot="beliefs.hero"
        image={heroImg}
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
  const heroImage = useActiveHero(city.name.toLowerCase() as "milano" | "bologna", city.hero);

  if (city.isPlant) {
    return (
      <>
        <PageHero
          slot={`${city.name.toLowerCase()}.hero` as never}
          image={heroImage}
          eyebrow={`Visita · ${city.name}`}
          title={<>Apriamo<br />a {city.launchLabel ?? "breve"}.</>}
          subtitle={`La Chiesa di Cristo di ${city.name} è in preparazione. Non abbiamo ancora una sede stabile né funzioni domenicali, ma ci piacerebbe restare in contatto con te.`}
          primaryCta={{ to: `${city.basePath}/contatti`, label: "Scrivici" }}
          height="medium"
        />
        <section className="container-narrow py-20">
          <p className="eyebrow mb-4">Cosa c'è oggi</p>
          <h2 className="font-display text-3xl mb-6">In attesa del lancio</h2>
          <ul className="space-y-5 text-foreground/80 leading-relaxed">
            <li><strong className="text-primary">Studi biblici personali.</strong> Possiamo incontrarci di persona o online per leggere insieme la Bibbia.</li>
            <li><strong className="text-primary">Preghiera.</strong> Stiamo pregando per {city.name} — unisciti a noi.</li>
            <li><strong className="text-primary">Aggiornamenti.</strong> Iscriviti per sapere quando, dove e come parteciperemo alle prime funzioni.</li>
            <li><strong className="text-primary">Funzioni a Milano.</strong> Nel frattempo, sei il benvenuto la domenica alle 10:30 nella chiesa di Milano.</li>
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
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

export function EventsSection({ city }: { city: CityConfig }) {
  const cityKey = city.name.toLowerCase() as "milano" | "bologna";
  const heroImage = useActiveHero(cityKey, city.hero);

  if (city.isPlant) {
    return (
      <>
        <PageHero
          slot={`${cityKey}.hero` as never}
          image={heroImage}
          eyebrow={`Eventi · ${city.name}`}
          title={<>La comunità<br />sta nascendo.</>}
          subtitle={`Non abbiamo ancora un calendario di eventi a ${city.name}. Lancio previsto per ${city.launchLabel ?? "presto"}.`}
          height="short"
        />
        <section className="container-narrow py-20 text-center">
          <p className="eyebrow mb-4">Resta in contatto</p>
          <h2 className="font-display text-3xl mb-6">Vuoi essere coinvolto?</h2>
          <p className="text-foreground/75 mb-8 max-w-xl mx-auto">
            Scrivici per sapere di più su incontri di preghiera, studi biblici
            e — quando arriverà il momento — la prima funzione domenicale a {city.name}.
          </p>
          <div className="mt-2">
            <Link to={`${city.basePath}/contatti`} className="btn-primary">
              Scrivici
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        slot={`${cityKey}.hero` as never}
        image={heroImage}
        eyebrow={`Eventi · ${city.name}`}
        title={<>La vita della<br />comunità.</>}
        subtitle="Funzioni, studi biblici, cene e progetti — c'è sempre qualcosa che succede."
        height="short"
      />
      <section className="container-prose py-16 md:py-20">
        <EventsCalendar city={cityKey} />
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
  const heroImage = useActiveHero(city.name.toLowerCase() as "milano" | "bologna", city.hero);
  const isPlant = city.isPlant === true;
  return (
    <>
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
        eyebrow={`Contatti · ${city.name}`}
        title={isPlant ? <>Camminiamo<br />insieme.</> : <>Facci sapere<br />se verrai.</>}
        subtitle={
          isPlant
            ? `Vivi a ${city.name} e vuoi far parte di questo nuovo inizio? Scrivici.`
            : "Compila il modulo. Non vediamo l'ora di conoscerti."
        }
        height="short"
      />
      <section className="container-prose py-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4">Scrivici</p>
          <h2 className="font-display text-3xl mb-6">Siamo qui per te.</h2>
          <p className="text-foreground/75 leading-relaxed mb-8">
            {isPlant
              ? `La Chiesa di Cristo di ${city.name} è in preparazione (lancio ${city.launchLabel ?? "prossimamente"}). Scrivici per uno studio biblico, per pregare insieme, o per unirti al gruppo fondatore.`
              : "Vuoi visitarci, iniziare uno studio biblico, o semplicemente scambiare due parole? Compila il modulo o scrivici una email. Risponderemo entro 24 ore."}
          </p>
          <ul className="space-y-3 text-foreground/85">
            <li><span className="eyebrow block mb-1">Email</span>info@chiesadicristoitalia.it</li>
            {isPlant ? (
              <li><span className="eyebrow block mb-1">Stato</span>Chiesa in fondazione · {city.launchLabel ?? "in arrivo"}</li>
            ) : (
              <>
                <li><span className="eyebrow block mb-1">Indirizzo</span>{city.address}<br />{city.cap} {city.name}</li>
                <li><span className="eyebrow block mb-1">Funzione</span>{city.serviceTime}</li>
              </>
            )}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <ContactForm
            city={city.name}
            defaultSubject={isPlant ? `Sostenere la chiesa di ${city.name}` : `Visitare la chiesa di ${city.name}`}
          />
        </div>
      </section>
    </>
  );
}

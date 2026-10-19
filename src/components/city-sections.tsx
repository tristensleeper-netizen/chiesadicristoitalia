import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";

import { Link } from "@tanstack/react-router";
import { useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import { EventsCalendar } from "@/components/events-calendar";
import { SpecialServiceNotice } from "@/components/special-service-notice";
import { BOLOGNA_SERVICE, isBolognaServiceDay } from "@/lib/special-service";
import worship from "@/assets/worship.jpg";
import bibleStudy from "@/assets/bible-study.jpg";
import milanoFamily from "@/assets/milano-family.jpg";

export interface CityConfig {
  name: "Milano" | "Bologna";
  hero: string;
  address?: string;
  cap?: string;
  serviceTime: string;
  mapsUrl?: string;
  basePath: "/milano" | "/bologna";
  /** True when the city is a "chiesa in fondazione" — no physical location/services yet. */
  isPlant?: boolean;
  /** When isPlant is true, a human-readable launch label like "4 Ottobre 2026". */
  launchLabel?: string;
  /** Name of the meeting place, when announced (e.g. "Hotel Europa – Sala Madrid"). */
  venueName?: string;
  /** Short note about the venue, e.g. "a 3 minuti dalla Stazione Centrale". */
  venueNote?: string;
}

export function AboutSection({ city }: { city: CityConfig }) {
  const heroImage = useActiveHero(city.name.toLowerCase() as "milano" | "bologna", city.hero);
  return (
    <>
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
        eyebrow={city.isPlant ? `Una nuova comunità · ${city.name}` : `Chi siamo · ${city.name}`}
        title={city.isPlant ? <>Una nuova<br />comunità.</> : <>Una famiglia<br />spirituale.</>}
        subtitle={
          city.isPlant
            ? `Una nuova Chiesa di Cristo a ${city.name}: ci ritroviamo ogni domenica alle 10:30, dal ${city.launchLabel ?? ""}.`
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
                Domenica {city.launchLabel} abbiamo celebrato la prima funzione
                della Chiesa di Cristo di {city.name}. Rendiamo grazie a Dio per
                questo nuovo inizio e per ogni persona che cammina con noi.
              </p>
              <p>
                {city.venueName
                  ? `Ci ritroviamo presso ${city.venueName} (${city.address}${city.venueNote ? `, ${city.venueNote}` : ""}) ogni domenica alle 10:30.`
                  : "Non abbiamo un edificio di culto e il luogo dei nostri incontri è ancora da confermare. Scrivici per sapere dove incontrarci."}{" "}
                Offriamo preghiera, studi biblici personali, lode e l'invito
                a camminare con noi mentre Dio apre la strada.
              </p>
              <p>
                Se vivi a {city.name} o nelle vicinanze e ti interessa fare
                parte di questa comunità — vieni a trovarci una domenica, oppure
                scrivici. Vogliamo conoscerti.
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
  const specialServiceToday = isBolognaServiceDay();
  const visitingMilanoToday = city.name === "Milano" && specialServiceToday;

  if (city.isPlant) {
    return (
      <>
        <SpecialServiceNotice context="bologna" />
        <PageHero
          slot={`${city.name.toLowerCase()}.hero` as never}
          image={heroImage}
          eyebrow={`Visita · ${city.name}`}
          title={<>Incontriamoci<br />a Bologna.</>}
          subtitle={
            city.venueName
              ? `La Chiesa di Cristo di ${city.name} si ritrova presso ${city.venueName}, ${city.address}${city.venueNote ? ` (${city.venueNote})` : ""}, ogni domenica alle 10:30.`
              : `La Chiesa di Cristo di ${city.name} non ha un edificio di culto. Il luogo dei nostri incontri è ancora da confermare: scrivici prima di venire.`
          }
          primaryCta={{ to: `${city.basePath}/contatti`, label: "Scrivici" }}
          height="medium"
        />
        <section className="container-narrow py-20">
          <p className="eyebrow mb-4">L'annuncio</p>
          <h2 className="font-display text-3xl mb-6">
            {city.venueName ? "Ecco dove ci ritroviamo." : "Luogo degli incontri da confermare."}
          </h2>
          {city.venueName ? (
            <div className="rounded-2xl border border-border bg-card p-8 max-w-xl">
              <p className="eyebrow mb-3">Dove</p>
              <p className="font-display text-2xl text-foreground">{city.venueName}</p>
              <p className="text-foreground/70">
                {city.address}
                {city.venueNote ? ` · ${city.venueNote}` : ""}
              </p>
              <p className="eyebrow mt-8 mb-3">Quando</p>
              <p className="font-display text-2xl text-foreground">
                Ogni domenica · 10:30 – 12:15
              </p>
              <a
                href={city.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 btn-outline w-full"
              >
                Apri in Google Maps
              </a>
            </div>
          ) : (
            <ul className="space-y-5 text-foreground/80 leading-relaxed">
              <li><strong className="text-primary">Studi biblici personali.</strong> Possiamo incontrarci di persona o online per leggere insieme la Bibbia.</li>
              <li><strong className="text-primary">Preghiera.</strong> Stiamo pregando per {city.name} — unisciti a noi.</li>
              <li><strong className="text-primary">Aggiornamenti.</strong> Iscriviti per sapere dove si terranno i prossimi incontri.</li>
              <li><strong className="text-primary">Funzioni a Milano.</strong> Nel frattempo, sei il benvenuto la domenica alle 10:30 nella chiesa di Milano.</li>
            </ul>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <SpecialServiceNotice />
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
        eyebrow={`Visita · ${city.name}`}
        title={visitingMilanoToday ? <>Oggi ci vediamo<br />a Bologna.</> : <>Vieni a trovarci<br />questa domenica.</>}
        subtitle={visitingMilanoToday ? `Domenica 4 ottobre · ${BOLOGNA_SERVICE.time} · ${BOLOGNA_SERVICE.venue}, ${BOLOGNA_SERVICE.address}, ${BOLOGNA_SERVICE.locality}. Nessuna funzione in Corso di Porta Vigentina oggi.` : `${city.serviceTime} · ${city.address}, ${city.cap} ${city.name}`}
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
          <p className="eyebrow mb-3">{visitingMilanoToday ? "Indirizzo di oggi" : "Indirizzo"}</p>
          {visitingMilanoToday && <p className="font-display text-xl text-primary">{BOLOGNA_SERVICE.venue}</p>}
          <p className="font-display text-2xl text-foreground">{visitingMilanoToday ? BOLOGNA_SERVICE.address : city.address}</p>
          <p className="text-foreground/70">{visitingMilanoToday ? BOLOGNA_SERVICE.locality : `${city.cap} ${city.name}`}</p>
          <p className="eyebrow mt-8 mb-3">Orario</p>
          <p className="font-display text-2xl text-foreground">{city.serviceTime}</p>
          <a
            href={visitingMilanoToday ? BOLOGNA_SERVICE.mapsUrl : city.mapsUrl}
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
        <SpecialServiceNotice context="bologna" />
        <PageHero
          slot={`${cityKey}.hero` as never}
          image={heroImage}
          eyebrow={`Eventi · ${city.name}`}
          title={<>La vita della<br />comunità.</>}
          subtitle={`Preghiera, studi biblici e comunione a ${city.name}. Il luogo degli incontri è ancora da confermare: scrivici per i dettagli.`}
          height="short"
        />
        <section className="container-narrow py-20 text-center">
          <p className="eyebrow mb-4">Resta in contatto</p>
          <h2 className="font-display text-3xl mb-6">Vuoi essere coinvolto?</h2>
          <p className="text-foreground/75 mb-8 max-w-xl mx-auto">
            Scrivici per sapere di più su incontri di preghiera, studi biblici
            e sulla vita della comunità a {city.name}.
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
      <SpecialServiceNotice />
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
  const visitingMilanoToday = city.name === "Milano" && isBolognaServiceDay();
  return (
    <>
      <SpecialServiceNotice context={isPlant ? "bologna" : "milano"} />
      <PageHero
        slot={`${city.name.toLowerCase()}.hero` as never}
        image={heroImage}
        eyebrow={`Contatti · ${city.name}`}
        title={isPlant ? <>Camminiamo<br />insieme.</> : <>Facci sapere<br />se verrai.</>}
        subtitle={
          isPlant
            ? `Vivi a ${city.name} e vuoi camminare con noi? Scrivici.`
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
              ? `La Chiesa di Cristo di ${city.name} si ritrova ogni domenica alle 10:30. Scrivici per visitarci, per uno studio biblico o per pregare insieme.`
              : "Vuoi visitarci, iniziare uno studio biblico, o semplicemente scambiare due parole? Compila il modulo o scrivici una email. Risponderemo entro 24 ore."}
          </p>
          <ul className="space-y-3 text-foreground/85">
            <li><span className="eyebrow block mb-1">Email</span>info@chiesadicristoitalia.it</li>
            {isPlant ? (
              <>
                <li><span className="eyebrow block mb-1">Luogo degli incontri</span>Da confermare · Scrivici prima di venire.</li>
                {city.venueName && (
                  <li>
                    <span className="eyebrow block mb-1">Dove</span>
                    {city.venueName}
                    <br />
                    {city.address}
                    {city.venueNote ? ` · ${city.venueNote}` : ""}
                  </li>
                )}
              </>
            ) : (
              <>
                <li><span className="eyebrow block mb-1">{visitingMilanoToday ? "Indirizzo di oggi" : "Indirizzo"}</span>{visitingMilanoToday ? `${BOLOGNA_SERVICE.venue}, ${BOLOGNA_SERVICE.address}` : city.address}<br />{visitingMilanoToday ? BOLOGNA_SERVICE.locality : `${city.cap} ${city.name}`}</li>
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

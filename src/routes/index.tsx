import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { VideoPopup } from "@/components/video-popup";
import { useSlotImage } from "@/lib/use-slot-image";
import heroItalia from "@/assets/hero-italia.jpg";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";
import sunsetItalia from "@/assets/sunset-italia.jpg";
import worshipImg from "@/assets/worship.jpg";

const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Chiesa di Cristo in Italia",
  alternateName: "Church of Christ Italy",
  url: "https://www.chiesadicristoitalia.it",
  description:
    "Una chiesa cristiana basata sulla Bibbia, del movimento di restaurazione, con comunità a Milano e Bologna.",
  location: [
    {
      "@type": "Place",
      name: "Chiesa di Cristo di Milano",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Corso di Porta Vigentina 15a",
        postalCode: "20122",
        addressLocality: "Milano",
        addressCountry: "IT",
      },
    },
    {
      "@type": "Place",
      name: "Chiesa di Cristo di Bologna",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bologna",
        addressCountry: "IT",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo in Italia | Milano e Bologna" },
      {
        name: "description",
        content:
          "Chiesa cristiana basata sulla Bibbia, con comunità a Milano, Bologna, Napoli e Sicilia. Tutti sono benvenuti. Vieni questa domenica.",
      },
      { property: "og:title", content: "Chiesa di Cristo in Italia" },
      {
        property: "og:description",
        content:
          "Una chiesa cristiana basata sulla Bibbia. Comunità a Milano, Bologna, Napoli e Sicilia. Tutti sono benvenuti.",
      },
      { property: "og:url", content: "https://chiesadicristoitalia.it/" },
    ],
    links: [
      { rel: "canonical", href: "https://chiesadicristoitalia.it/" },
      { rel: "preload", as: "image", href: heroItalia, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(churchJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Dove si trova la Chiesa di Cristo in Italia?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La Chiesa di Cristo in Italia ha comunità a Milano (Corso di Porta Vigentina 15a), Bologna, Napoli e Sicilia. Ogni comunità è autonoma e si riunisce la domenica mattina.",
              },
            },
            {
              "@type": "Question",
              name: "Cos'è la Chiesa di Cristo?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La Chiesa di Cristo è un movimento cristiano del Restaurazione nato nel XIX secolo che si basa esclusivamente sulla Bibbia come unica regola di fede. Non appartiene a nessuna denominazione, pratica il battesimo per immersione dei credenti e celebra la Cena del Signore ogni domenica.",
              },
            },
            {
              "@type": "Question",
              name: "Quando si riunisce la chiesa?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Le riunioni domenicali a Milano si tengono alle 10:30. La comunità di Bologna è in fase di fondazione con lancio previsto per settembre 2026. Per orari aggiornati visita la pagina della tua città.",
              },
            },
            {
              "@type": "Question",
              name: "È necessario essere già cristiani per venire?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Tutti sono benvenuti, qualunque sia la loro storia o il loro punto di partenza. Chi è curioso, chi ha dubbi, chi viene da una tradizione diversa — la porta è aperta.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const homeHero = useSlotImage("home.hero", heroItalia);
  const milanoImg = useSlotImage("home.milano", heroMilano);
  const bolognaImg = useSlotImage("home.bologna", heroBologna);
  return (
    <>
      <PageHero
        slot="home.hero"
        image={homeHero}
        eyebrow="Chiesa di Cristo · Italia"
        title={<>Una chiesa cristiana<br />a Milano e Bologna.</>}
        subtitle="Comunità di persone che cercano insieme di vivere come Gesù — una famiglia che ti aspetta."
        primaryCta={{ to: "/milano", label: "Trova la chiesa di Milano" }}
        secondaryCta={{ to: "/bologna", label: "Trova la chiesa di Bologna" }}
      />

      {/* City selector — moved up, full-width, immediately after hero */}
      <section className="relative container-prose pt-8 md:pt-10 pb-6 md:pb-8">
        <p className="eyebrow text-center mb-3">Dove vuoi incontrarci?</p>
        <h2 className="font-display text-center text-3xl md:text-4xl mb-10">Le nostre comunità</h2>

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
            description="Chiesa in fondazione. Lancio previsto per settembre 2026."
            accent="from-red-900/40 to-red-950/80"
          />
        </div>
      </section>

      {/* Welcome — split layout */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%), linear-gradient(180deg, var(--background), var(--primary-soft) 55%, var(--background))",
          }}
        />

        <div className="container-prose py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
            {/* Left — heading */}
            <div>
              <p className="eyebrow mb-6">Benvenuti</p>
              <h2 className="font-display text-foreground leading-[1.1] text-4xl md:text-5xl lg:text-6xl font-normal text-balance">
                Gesù, un uomo semplice con un piano semplice:{" "}
                <em className="italic text-primary">far conoscere Dio e il suo amore.</em>
              </h2>
            </div>

            {/* Right — body */}
            <div className="space-y-5 text-foreground/75 leading-relaxed text-base md:text-lg">
              <p>
                Siamo una <strong>chiesa cristiana</strong>: persone semplici che vogliono
                seguire le orme di Cristo, leggendo la Bibbia e vivendola ogni giorno.
                Non apparteniamo ad alcuna denominazione e ogni comunità locale è autonoma —
                quello che ci tiene insieme è la fede in Gesù, l'amore reciproco e il
                desiderio di tornare alla semplicità della chiesa del Nuovo Testamento.
                Che tu stia cercando una <strong>chiesa cristiana a Milano</strong>, una{" "}
                <strong>chiesa cristiana a Bologna</strong>, o semplicemente un luogo dove
                fare domande sincere su Dio, qui sei a casa.
              </p>
              <p>
                La nostra fede si fonda esclusivamente sulla <strong>Bibbia</strong>:
                nessun credo umano, nessuna tradizione aggiunta, solo la Parola di Dio
                come unica regola di fede e di vita. Crediamo nella potenza della
                preghiera, nelle amicizie sincere che ci avvicinano a Dio e in una
                comunità che accoglie chiunque, senza condizioni — qualunque sia la tua
                storia, il tuo passato o il punto in cui ti trovi nel tuo cammino
                spirituale. Se vuoi approfondire,{" "}
                <Link to="/chi-siamo" className="text-primary underline-offset-4 hover:underline">
                  scopri chi siamo
                </Link>
                ,{" "}
                <Link to="/sermoni" className="text-primary underline-offset-4 hover:underline">
                  ascolta i nostri sermoni
                </Link>{" "}
                o{" "}
                <Link to="/risorse" className="text-primary underline-offset-4 hover:underline">
                  leggi articoli e guarda video
                </Link>
                .
              </p>
              <p>
                La <strong>Chiesa di Cristo</strong> nasce dal cosiddetto{" "}
                <em>movimento di restaurazione</em>: un'aspirazione antica e sempre nuova
                a essere semplicemente cristiani — come lo erano i discepoli nel primo
                secolo, prima di etichette e divisioni. Per questo non ci chiamiamo con
                il nome di un fondatore umano, non abbiamo una gerarchia centrale e non
                seguiamo un manuale denominazionale: ogni domenica ci ritroviamo per
                spezzare il pane insieme nella <strong>Cena del Signore</strong>,
                pratichiamo il <strong>battesimo per immersione</strong> dei credenti
                come risposta alla fede in Cristo, e cerchiamo di vivere il Vangelo nella
                vita quotidiana, nel lavoro, nelle relazioni e nel servizio agli altri.
              </p>
              <p>
                Se sei in Italia e stai cercando una famiglia spirituale, un posto dove
                sentirti a casa, la porta è aperta questa domenica oppure quando vuoi tu.
                Vieni così come sei: con le tue domande, i tuoi dubbi, le tue speranze.
                Non devi vestirti in un certo modo, conoscere la Bibbia a memoria o aver
                già capito tutto — basta il desiderio di incontrare Dio e di camminare
                con altre persone che stanno facendo lo stesso percorso.
                <br />
                <span className="text-foreground/60 text-sm md:text-base italic">
                  English speakers are welcome — Sunday services are in Italian, with
                  translation available.
                </span>
              </p>
            </div>
          </div>

          {/* Community photo — full-width editorial break */}
          <div className="mt-12 md:mt-16 w-full overflow-hidden rounded-2xl aspect-[21/9] relative">
            <img
              src={worshipImg}
              alt="La comunità in preghiera insieme"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          </div>

          {/* Scripture — left-aligned pull-quote */}
          <figure className="mt-16 md:mt-20 max-w-4xl pl-8 md:pl-16 border-l-2 border-primary/30">
            <blockquote className="font-display italic text-foreground leading-[1.2] text-3xl md:text-4xl lg:text-5xl font-normal text-balance">
              E io ho fatto loro conoscere il tuo nome e lo farò conoscere ancora, affinché l'amore, del quale tu mi hai amato, sia in loro e io in loro.
            </blockquote>
            <figcaption className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Vangelo secondo Giovanni · 17:26
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Beliefs — editorial pillars on cream background */}
      <section className="relative">
        <div className="container-prose py-16 md:py-20">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Tre pilastri</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Cosa ci tiene <em className="not-italic text-primary">insieme</em>.
            </h2>
          </div>

          <ul className="mx-auto max-w-4xl divide-y border-y border-primary/10">
            {[
              {
                t: "Bibbia",
                d: "La Parola di Dio guida ogni cosa che facciamo — la leggiamo insieme, la mettiamo in pratica, ci lasciamo correggere e consolare.",
                verse: "«La tua parola è una lampada al mio piede e una luce sul mio cammino.» — Salmo 119:105",
              },
              {
                t: "Comunità",
                d: "Amicizie profonde, sincere e quotidiane — non un evento la domenica, ma una famiglia spirituale che cammina insieme.",
                verse: "«Dove due o tre sono riuniti nel mio nome, lì sono io in mezzo a loro.» — Matteo 18:20",
              },
              {
                t: "Missione",
                d: "Portare speranza a chi ancora non l'ha trovata — nelle nostre città, nei nostri quartieri, con le persone che incontriamo ogni giorno.",
                verse: "«Andate dunque e fate discepoli di tutte le nazioni.» — Matteo 28:19",
              },
            ].map((item, i) => (
              <li
                key={item.t}
                className="group grid grid-cols-[auto_1fr] gap-6 md:gap-12 items-start py-10 md:py-14"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-6xl md:text-8xl leading-none text-primary/25 tabular-nums select-none transition-colors duration-500 group-hover:text-primary/45"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                    {item.t}
                  </h3>
                  <p className="text-foreground/75 leading-relaxed text-base md:text-lg max-w-2xl">
                    {item.d}
                  </p>
                  <p
                    className="mt-5 text-sm md:text-base leading-relaxed text-foreground/55 max-w-2xl"
                    style={{ fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {item.verse}
                  </p>
                  <div className="mt-6 h-px w-10 bg-primary/60 transition-all duration-500 group-hover:w-24" />
                </div>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link to="/milano" className="btn-primary inline-flex items-center gap-2">
              Vieni a trovarci questa domenica
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured sermon — near the bottom */}
      <section className="container-prose pt-8 md:pt-12 text-center">
        <p className="eyebrow mb-3">Sermone in evidenza</p>
        <p className="text-foreground/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Ogni settimana condividiamo una predicazione dalla nostra comunità —
          un momento per fermarsi, ascoltare e lasciarsi parlare dalla Parola.
        </p>
      </section>

      <VideoPopup
        videoUrl="https://youtu.be/36FDh_7AYkk"
        title="La presenza e la potenza dello Spirito Santo"
        eyebrow="Sermone in evidenza"
        duration="Sermone"
        slug="presenza-potenza-spirito-santo"
      />
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
      className="group relative block overflow-hidden rounded-3xl aspect-[3/2] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/75 mb-3">{tagline}</p>
        <h3 className="font-display text-5xl md:text-6xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">{name}</h3>
        <p className="mt-4 max-w-md text-white/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">{description}</p>
        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-sm font-medium transition-all group-hover:bg-white group-hover:text-primary group-hover:border-white">
          Visita la chiesa di {name}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}




import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import heroItalia from "@/assets/hero-italia.jpg";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";
import heroNapoli from "@/assets/hero-napoli.jpg";
import heroSicilia from "@/assets/hero-sicilia.jpg";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Chiesa di Cristo in Italia | Chiesa Cristiana" },
      {
        name: "description",
        content:
          "Conosci la Chiesa di Cristo in Italia: una chiesa cristiana del movimento di restaurazione, con comunità a Milano e Bologna.",
      },
      { property: "og:title", content: "Chi siamo — Chiesa di Cristo in Italia" },
      {
        property: "og:description",
        content:
          "Una chiesa cristiana del movimento di restaurazione, con comunità a Milano e Bologna.",
      },
      { property: "og:image", content: heroItalia },
    ],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <>
      <PageHero
        image={heroItalia}
        eyebrow="Chi siamo · Italia"
        title={<>La Chiesa di Cristo<br />in Italia.</>}
        subtitle="Una famiglia di chiese cristiane in Italia, unite dalla Bibbia, dalla preghiera e dal desiderio di seguire Gesù ogni giorno."
        height="medium"
      />

      {/* Intro */}
      <section className="container-narrow py-20 md:py-24">
        <p className="eyebrow mb-5">Chi siamo</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6 leading-tight">
          Una famiglia spirituale in Italia.
        </h2>
        <div className="space-y-5 text-foreground/80 leading-relaxed">
          <p>
            La Chiesa di Cristo in Italia è una famiglia di comunità cristiane che si
            ritrovano per pregare, leggendo la Bibbia insieme, e per camminare nella fede
            le une accanto alle altre. Siamo persone, di età e provenienze
            diverse, che cercano semplicemente di seguire Gesù e di vivere il Vangelo nella
            quotidianità.
          </p>
          <p>
            Oggi siamo presenti con comunità a Milano e Bologna, e con piccoli gruppi a
            Napoli e a Palermo. Se sei in Italia e cerchi una famiglia spirituale, una
            chiesa dove sentirti a casa, la porta è aperta: vieni a trovarci una domenica
            o scrivici quando vuoi.
          </p>
        </div>
      </section>

      {/* Identità */}
      <section className="bg-primary-soft">
        <div className="container-narrow py-20 md:py-24">
          <p className="eyebrow mb-5">La nostra identità</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6 leading-tight">
            Una chiesa cristiana, semplice.
          </h2>
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              Siamo una <strong>chiesa cristiana</strong>: non
              apparteniamo ad alcuna denominazione, non rispondiamo a una gerarchia
              ecclesiastica esterna e ogni comunità locale è autonoma. Quello che ci tiene
              insieme non è una struttura, ma una fede comune: <em>Gesù Cristo</em>, la
              <em> Parola di Dio</em> e l'amore reciproco.
            </p>
            <p>
              La nostra fede si fonda esclusivamente sulla Bibbia. Non aggiungiamo nulla a
              ciò che troviamo nelle Scritture, e non vogliamo togliere nulla. Cerchiamo
              di vivere come la prima chiesa descritta nel Nuovo Testamento — semplici,
              uniti, dediti alla preghiera, all'insegnamento degli apostoli e alla
              comunione fraterna.
            </p>
            <p>
              Ci chiamiamo <strong>Chiesa di Cristo</strong> perché vogliamo appartenere
              a lui solo. Non a un movimento, non a un fondatore umano, non a una
              tradizione: a Cristo. E vogliamo vivere come ha vissuto lui: con umiltà,
              compassione e verità.
            </p>
          </div>
        </div>
      </section>

      {/* Cosa ci unisce */}
      <section className="container-narrow py-20 md:py-24">
        <p className="eyebrow mb-5">Cosa ci unisce</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10 leading-tight">
          Tre pilastri semplici.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Bibbia",
              d: "La Parola di Dio guida ogni cosa che facciamo, dalle nostre decisioni alle nostre relazioni.",
            },
            {
              t: "Comunità",
              d: "Amicizie sincere, profonde, quotidiane. Una famiglia spirituale prima di tutto.",
            },
            {
              t: "Missione",
              d: "Portare la speranza di Gesù a chi ancora non l'ha incontrato, in ogni città in cui siamo.",
            },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h3 className="font-display text-2xl text-primary mb-3">{item.t}</h3>
              <p className="text-foreground/75 leading-relaxed text-sm">{item.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Vuoi approfondire? Leggi la nostra pagina{" "}
          <Link to="/milano/cosa-crediamo" className="text-primary underline-offset-4 hover:underline">
            cosa crediamo
          </Link>
          .
        </p>
      </section>

      {/* Le nostre comunità */}
      <section className="bg-primary-soft">
        <div className="container-prose py-20 md:py-24">
          <p className="eyebrow text-center mb-3">Le nostre comunità</p>
          <h2 className="font-display text-center text-3xl md:text-4xl mb-12">
            Dove ci troviamo.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <CityTile to="/milano" name="Milano" image={heroMilano} subtitle="Chiesa di Cristo di Milano" />
            <CityTile to="/bologna" name="Bologna" image={heroBologna} subtitle="In fondazione · Settembre 2026" />
            <CityTile to="/napoli" name="Napoli" image={heroNapoli} subtitle="Piccola comunità in casa" />
            <CityTile to="/sicilia" name="Palermo" image={heroSicilia} subtitle="Piccola comunità in casa" />
          </div>
        </div>
      </section>

      {/* English clarifier */}
      <section className="container-narrow py-16 md:py-20">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="eyebrow mb-3">For English speakers</p>
          <p className="text-foreground/80 leading-relaxed">
            English speakers are warmly welcome at any of our churches in Italy. Sunday
            services are in Italian, with informal translation available — just let us
            know you're coming and we'll make sure someone is there to help.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow pb-20 md:pb-24">
        <div className="text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-6">
            Vieni a conoscerci.
          </h2>
          <p className="text-foreground/75 leading-relaxed mb-8 max-w-xl mx-auto">
            Ascolta i nostri{" "}
            <Link to="/sermoni" className="text-primary underline-offset-4 hover:underline">sermoni</Link>
            , esplora le nostre{" "}
            <Link to="/risorse" className="text-primary underline-offset-4 hover:underline">risorse</Link>
            , o vieni a trovarci una domenica.
          </p>
          <Link
            to="/milano"
            className="inline-flex items-center gap-2 font-display text-xl md:text-2xl text-primary hover:gap-4 transition-all"
          >
            Trova la chiesa più vicina
            <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function CityTile({
  to,
  name,
  subtitle,
  image,
}: {
  to: "/milano" | "/bologna" | "/napoli" | "/sicilia";
  name: string;
  subtitle: string;
  image: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5]"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/75 mb-1">{subtitle}</p>
        <h3 className="font-display text-2xl">{name}</h3>
      </div>
    </Link>
  );
}

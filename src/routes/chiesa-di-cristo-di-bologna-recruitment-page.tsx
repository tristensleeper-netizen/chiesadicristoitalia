import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHero } from "@/components/page-hero";
import { ScriptureMarquee } from "@/components/scripture-marquee";
import { useActiveHero } from "@/lib/use-city-events";
import { useSlotImage } from "@/lib/use-slot-image";
import { GraduationCap, Plane, Briefcase, Heart, Flag, HandHeart, Megaphone, Mail } from "lucide-react";
import type { ReactNode } from "react";
import heroBologna from "@/assets/hero-bologna.jpg";
import worship from "@/assets/worship.jpg";

export const Route = createFileRoute("/chiesa-di-cristo-di-bologna-recruitment-page")({
  head: () => ({
    meta: [
      { title: "Unisciti alla missione — Chiesa di Cristo di Bologna · Settembre 2026" },
      {
        name: "description",
        content:
          "La prima fondazione ICOC in Italia in 30 anni. Stiamo cercando italiani, studenti, pensionati, nomadi digitali e One Year Challengers per fondare la Chiesa di Cristo di Bologna a settembre 2026.",
      },
      { property: "og:title", content: "Unisciti alla missione — Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content: "Join the mission — settembre 2026. Recruitment per la prima fondazione ICOC in Italia in 30 anni.",
      },
      { property: "og:image", content: heroBologna },
      { name: "twitter:image", content: heroBologna },
    ],
  }),
  component: RecruitmentPage,
});

function RecruitmentPage() {
  const heroImage = useActiveHero("bologna", heroBologna);
  const storyImage = useSlotImage("bologna.recruitment.story", worship);

  // Load the Fillout embed script
  useEffect(() => {
    const existing = document.querySelector('script[src="https://server.fillout.com/embed/v1/"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <PageHero
        slot="bologna.recruitment.hero"
        image={heroImage}
        eyebrow="Recruitment · Lancio Settembre 2026"
        title={<>Unisciti alla<br />missione.</>}
        subtitle="La prima fondazione ICOC in Italia in 30 anni. Stiamo cercando persone disposte a trasferirsi a Bologna per fondare insieme una nuova Chiesa di Cristo."
        primaryCta={{ to: "/chiesa-di-cristo-di-bologna-recruitment-page", label: "Compila il form" }}
        secondaryCta={{ to: "/bologna", label: "Scopri Bologna" }}
        align="left"
      />

      {/* About Bologna */}
      <section className="container-prose py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <p className="eyebrow mb-5">La città</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Bologna — La Grassa, La Dotta, La Rossa.
          </h2>
          <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed">
            <p>
              Conosciuta come <em>La Grassa</em> (per la cucina), <em>La Dotta</em> (per
              l'università) e <em>La Rossa</em> (per i tetti e la storia), Bologna è una
              città di immenso significato storico, intellettuale e culinario. A solo 2
              ore a sud-est di Milano, è la settima città più grande d'Italia.
              L'<em>Università di Bologna</em>, la più antica al mondo in attività
              continua, conta oltre 80.000 studenti ed è un crocevia del Paese.
            </p>
            <p>
              Mentre la città è famosa per i suoi chilometri di portici tutelati
              dall'UNESCO e per la ricchezza della sua tradizione gastronomica, rimane
              una significativa fame spirituale. Vediamo Bologna non solo come una
              meta bellissima, ma come una porta dove il vangelo può mettere radici e
              fiorire in una popolazione urbana e moderna.
            </p>
          </div>
        </div>
        <img
          src={storyImage}
          alt="Bologna — portici e vita di città"
          loading="lazy"
          className="rounded-3xl object-cover aspect-[4/5] w-full"
        />
      </section>

      <ScriptureMarquee reverse />

      {/* Story & Mission */}
      <section className="container-prose py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">La nostra storia e missione</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            La prima fondazione ICOC in Italia in 30 anni.
          </h2>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2 text-foreground/80 leading-relaxed">
          <div className="space-y-5">
            <p className="text-primary text-lg leading-relaxed">
              <strong>La Chiesa di Cristo di Bologna è la prima fondazione ICOC in
              Italia in 30 anni.</strong> Ti invitiamo a camminare con noi attraverso
              la preghiera, il sostegno economico, o unendoti al team mentre entriamo
              in questo nuovo capitolo di ministero. Con l'aiuto di Dio, possiamo
              portare la luce del Vangelo a una città che ha plasmato la storia per
              secoli.
            </p>
            <p>
              Il nostro cammino è iniziato con preghiera e digiuno all'inizio del 2025,
              quando alcuni discepoli della Chiesa di Cristo di Milano hanno
              cominciato a sognare la prossima chiesa italiana. Guidato da due
              italiani nativi, con il supporto della European Missions Society, il
              nostro gruppo è cresciuto fino a includere otto discepoli da Milano e
              da varie chiese statunitensi.
            </p>
          </div>
          <div className="space-y-5">
            <p>
              Abbiamo posto il nostro cuore su Bologna per la sua enorme popolazione
              universitaria e per la vicinanza alla nostra chiesa sorella di Milano.
              Durante la primavera del 2026, il nostro team si incontrerà per
              costruire relazioni e gestire la logistica di alloggi e visti.
            </p>
            <p>
              Se Dio vuole, <strong>settembre 2026</strong> porterà le prime funzioni
              di questa nuova famiglia di discepoli.
            </p>
          </div>
        </div>
      </section>

      {/* Five missionary types */}
      <section className="bg-card border-y border-border">
        <div className="container-prose py-20 md:py-28">
          <div className="mb-14 max-w-3xl">
            <p className="eyebrow mb-5">Chi stiamo cercando</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Cinque tipi di missionari per settembre 2026.
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed">
              Cerchiamo persone disposte a trasferirsi a Bologna questo settembre per
              unirsi alla nostra comunità nell'amare Dio, gli uni gli altri e il nostro
              prossimo.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              icon={<Flag className="h-6 w-6" strokeWidth={1.75} />}
              title="Italiani"
              text="Porta il vangelo nella tua terra. Se sei italiano e senti il chiamato a casa, c'è posto per te."
            />
            <RoleCard
              icon={<GraduationCap className="h-6 w-6" strokeWidth={1.75} />}
              title="Studenti"
              text="Avvia un ministero universitario durante un anno di studio all'estero a Bologna, città di oltre 80.000 studenti."
            />
            <RoleCard
              icon={<Heart className="h-6 w-6" strokeWidth={1.75} />}
              title="Pensionati"
              text="Persone o coppie che terminano la professione ma continuano la missione. Una nuova stagione di servizio."
            />
            <RoleCard
              icon={<Briefcase className="h-6 w-6" strokeWidth={1.75} />}
              title="Nomadi digitali"
              text="Usa la tua libertà professionale per servirci umilmente nell'amore, lavorando da remoto nel cuore di Bologna."
            />
            <RoleCard
              icon={<Plane className="h-6 w-6" strokeWidth={1.75} />}
              title="One Year Challengers"
              text="Se hai i risparmi e sei disposto a passare un anno servendo Dio in questa fondazione, ti vogliamo con noi!"
            />
          </div>
        </div>
      </section>

      {/* How to apply + Form */}
      <section id="form" className="container-prose py-20 md:py-28 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="eyebrow mb-5">Come candidarti</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Compila il form qui accanto.
          </h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            Se senti il chiamato a unirti a noi, compila il modulo di interesse. Come
            parte del processo, ti chiederemo:
          </p>
          <ul className="mt-6 space-y-4 text-foreground/80">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                Un breve <strong>video di presentazione</strong> in cui condividi chi
                sei e perché vuoi partecipare a questa fondazione.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                Una <strong>lettera di sostegno</strong> dal tuo attuale ministro,
                anziano o leadership della tua chiesa.
              </span>
            </li>
          </ul>
          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <p className="text-sm text-foreground/70">
              Hai altre domande prima di candidarti? Scrivici:
            </p>
            <a
              href="mailto:tristen.sleeper@gmail.com"
              className="mt-2 inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              tristen.sleeper@gmail.com
            </a>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-border bg-card p-4 md:p-6 shadow-[var(--shadow-soft)]">
            <div
              style={{ width: "100%", height: "720px" }}
              data-fillout-id="4x29cCGGLYus"
              data-fillout-embed-type="standard"
              data-fillout-inherit-parameters
              data-fillout-dynamic-resize
            />
          </div>
        </div>
      </section>

      {/* Other ways to support */}
      <section className="bg-card border-t border-border">
        <div className="container-prose py-20 md:py-28">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow mb-5">Altri modi per sostenerci</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Se trasferirti non è la tua strada, puoi comunque camminare con noi.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <SupportCard
              icon={<HandHeart className="h-6 w-6" strokeWidth={1.75} />}
              title="Prega"
              text="Iniziare una nuova chiesa è più grande di ogni nostro talento. Prega che riusciamo a ottenere lavoro, alloggi e visti per essere presenti. Prega che sviluppiamo una comunità d'amore e che Dio ci benedica per condividerla con altri."
            />
            <SupportCard
              icon={<Megaphone className="h-6 w-6" strokeWidth={1.75} />}
              title="Spargi la voce"
              text="Parla ad altri di questa fondazione. Anche le loro preghiere sono preziose. E forse, per qualcuno di loro, questa è proprio l'opportunità verso cui Dio li sta muovendo."
            />
          </div>
        </div>
      </section>

      {/* Closing verse */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="container-prose relative z-10 h-full flex flex-col justify-center text-center text-white">
          <p className="eyebrow text-white/80 mb-4">Una promessa</p>
          <h2 className="font-display text-3xl md:text-5xl max-w-3xl mx-auto leading-tight italic">
            "Nessuno accende una lampada e la mette sotto un vaso o sotto il letto;
            anzi la mette sul candeliere, perché chi entra veda la luce."
          </h2>
          <p className="mt-6 text-white/80">— Luca 8:16</p>
        </div>
      </section>
    </>
  );
}

function RoleCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="group rounded-3xl border border-border bg-background p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-3 text-foreground/75 leading-relaxed">{text}</p>
    </div>
  );
}

function SupportCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-3 text-foreground/75 leading-relaxed">{text}</p>
    </div>
  );
}

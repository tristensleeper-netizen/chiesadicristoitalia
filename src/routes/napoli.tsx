import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import heroNapoli from "@/assets/hero-napoli.jpg";

export const Route = createFileRoute("/napoli")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo di Napoli — Piccola comunità in casa" },
      { name: "description", content: "Una piccola comunità cristiana che si incontra in casa a Napoli. Scrivici per visitarci." },
      { property: "og:title", content: "Chiesa di Cristo di Napoli" },
      { property: "og:description", content: "Piccola comunità accogliente. Scrivici e ti raccontiamo dove e quando." },
      { property: "og:image", content: heroNapoli },
    ],
  }),
  component: NapoliPage,
});

function NapoliPage() {
  return (
    <>
      <PageHero
        image={heroNapoli}
        eyebrow="Chiesa di Cristo"
        title={<>Napoli.</>}
        subtitle="Una piccola comunità che si incontra in casa. Pochi numeri, tanto cuore — saremmo felici di conoscerti."
        height="medium"
      />
      <section className="container-narrow py-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4">Come funziona</p>
          <h2 className="font-display text-3xl mb-6">Chiesa di casa.</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            A Napoli ci ritroviamo in casa, in piccoli gruppi. È il modo più
            semplice per studiare la Bibbia, condividere la vita e pregare
            insieme. Se vuoi venire, scrivici — ti diremo dove e quando.
          </p>
          <ul className="space-y-3 text-foreground/85">
            <li><span className="eyebrow block mb-1">Email</span>info@chiesadicristoitalia.it</li>
            <li><span className="eyebrow block mb-1">Quando</span>Su appuntamento — di solito la domenica</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <ContactForm city="Napoli" defaultSubject="Visitare la chiesa di Napoli" />
        </div>
      </section>
    </>
  );
}

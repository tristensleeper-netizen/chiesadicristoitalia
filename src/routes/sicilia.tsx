import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { useSlotImage } from "@/lib/use-slot-image";
import heroSicilia from "@/assets/hero-sicilia.jpg";

export const Route = createFileRoute("/sicilia")({
  head: () => ({
    meta: [
      { title: "Chiesa di Cristo a Palermo — Piccola comunità in casa" },
      { name: "description", content: "Una piccola comunità cristiana a Palermo. Ci troviamo in casa. Scrivici per conoscerci." },
      { property: "og:title", content: "Chiesa di Cristo a Palermo" },
      { property: "og:description", content: "Piccola comunità accogliente a Palermo. Scrivici per visitarci." },
      { property: "og:image", content: heroSicilia },
    ],
    links: [{ rel: "canonical", href: "https://chiesadicristoitalia.it/sicilia" }],
  }),
  component: SiciliaPage,
});

function SiciliaPage() {
  const hero = useSlotImage("sicilia.hero", heroSicilia);
  return (
    <>
      <PageHero
        slot="sicilia.hero"
        image={hero}
        eyebrow="Chiesa di Cristo"
        title={<>Palermo.</>}
        subtitle="Una piccola comunità che si incontra in casa. Tanto calore mediterraneo, tanta voglia di conoscerti."
        height="medium"
      />
      <section className="container-narrow py-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4">Come funziona</p>
          <h2 className="font-display text-3xl mb-6">Chiesa di casa.</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            A Palermo ci ritroviamo in piccoli gruppi nelle case. Studiamo la
            Bibbia, condividiamo la cena, preghiamo insieme. Se vuoi unirti,
            scrivici — ti raccontiamo dove e quando.
          </p>
          <ul className="space-y-3 text-foreground/85">
            <li><span className="eyebrow block mb-1">Email</span>info@chiesadicristoitalia.it</li>
            <li><span className="eyebrow block mb-1">Quando</span>Su appuntamento — di solito la domenica</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <ContactForm city="Palermo" defaultSubject="Visitare la chiesa a Palermo" />
        </div>
      </section>
    </>
  );
}

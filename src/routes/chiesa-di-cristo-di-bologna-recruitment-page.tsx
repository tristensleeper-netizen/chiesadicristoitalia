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
      { title: "Join the Mission — Chiesa di Cristo di Bologna · September 2026" },
      {
        name: "description",
        content:
          "The first ICOC church planting in Italy in 30 years. We're recruiting Italians, students, retirees, digital nomads, and One Year Challengers to plant the Chiesa di Cristo di Bologna in September 2026.",
      },
      { property: "og:title", content: "Join the Mission — Chiesa di Cristo di Bologna" },
      {
        property: "og:description",
        content: "Join the mission — September 2026. Recruitment for the first ICOC church planting in Italy in 30 years.",
      },
      { property: "og:image", content: heroBologna },
      { name: "twitter:image", content: heroBologna },
    ],
  }),
  component: RecruitmentPage,
});

function RecruitmentPage() {
  const heroImage = useActiveHero("bologna", heroBologna);
  const storyImage = useSlotImage("bologna.welcome", worship);

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
        slot="bologna.hero"
        image={heroImage}
        eyebrow="Recruitment · Launching September 2026"
        title={<>Join the<br />mission.</>}
        subtitle="The first ICOC church planting in Italy in 30 years. We're looking for people willing to move to Bologna to plant a new Chiesa di Cristo together."
        primaryCta={{ to: "/chiesa-di-cristo-di-bologna-recruitment-page", label: "Fill out the form" }}
        secondaryCta={{ to: "/bologna", label: "Discover Bologna" }}
        align="left"
      />

      {/* About Bologna */}
      <section className="container-prose py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <p className="eyebrow mb-5">The city</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Bologna — La Grassa, La Dotta, La Rossa.
          </h2>
          <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed">
            <p>
              Known as <em>La Grassa</em> (the fat), <em>La Dotta</em> (the learned),
              and <em>La Rossa</em> (the red), Bologna is a city of immense historical,
              intellectual, and culinary significance. Located just 2 hours south-east
              of Milan, it is the seventh largest city in Italy. The{" "}
              <em>Università di Bologna</em>, the oldest university in continuous
              operation, has over 80,000 students and is a crossroads of Italy.
            </p>
            <p>
              While the city is famous for its miles of UNESCO-protected porticoes
              and rich culinary traditions, there remains a significant spiritual
              hunger. We see Bologna not just as a beautiful destination, but as a
              gateway where the gospel can take root and flourish in a modern, urban
              population.
            </p>
          </div>
        </div>
        <img
          src={storyImage}
          alt="Bologna — porticoes and city life"
          loading="lazy"
          className="rounded-3xl object-cover aspect-[4/5] w-full"
        />
      </section>

      <ScriptureMarquee reverse />

      {/* Story & Mission */}
      <section className="container-prose py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">Our story & mission</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            The first ICOC church planting in Italy in 30 years.
          </h2>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2 text-foreground/80 leading-relaxed">
          <div className="space-y-5">
            <p className="text-primary text-lg leading-relaxed">
              <strong>La Chiesa di Cristo di Bologna is the first ICOC planting in
              Italy in 30 years.</strong> We invite you to partner with us through
              prayer, financial support, or by joining our team as we step into this
              new chapter of ministry. With God's help, we can bring the light of the
              Gospel to a city that has shaped history for centuries.
            </p>
            <p>
              Our journey began with prayer and fasting in early 2025, as disciples
              from the Chiesa di Cristo di Milano began dreaming of the next Italian
              church. Led by two native-born Italians, with the support of the
              European Missions Society, our group has grown to include eight
              disciples from Milan and various US churches.
            </p>
          </div>
          <div className="space-y-5">
            <p>
              We set our hearts on Bologna because of its massive university
              population and its proximity to our sister church in Milan. Throughout
              the spring of 2026, our team is meeting to build relationships and
              navigate the logistics of housing and visas.
            </p>
            <p>
              God willing, <strong>September 2026</strong> will bring the first
              services for this new family of disciples.
            </p>
          </div>
        </div>
      </section>

      {/* Five missionary types */}
      <section className="bg-card border-y border-border">
        <div className="container-prose py-20 md:py-28">
          <div className="mb-14 max-w-3xl">
            <p className="eyebrow mb-5">Who we're looking for</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Five types of missionaries for September 2026.
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed">
              We're seeking people willing to move to Bologna this September to join
              our community in loving God, one another, and our neighbors.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              icon={<Flag className="h-6 w-6" strokeWidth={1.75} />}
              title="Italians"
              text="Bring the gospel to your homeland. If you're Italian and feel called home, there's a place for you."
            />
            <RoleCard
              icon={<GraduationCap className="h-6 w-6" strokeWidth={1.75} />}
              title="Students"
              text="Start a campus ministry during a year of study abroad in Bologna, a city of over 80,000 students."
            />
            <RoleCard
              icon={<Heart className="h-6 w-6" strokeWidth={1.75} />}
              title="Retirees"
              text="Individuals or couples ending their profession but continuing their commission. A new season of service."
            />
            <RoleCard
              icon={<Briefcase className="h-6 w-6" strokeWidth={1.75} />}
              title="Digital nomads"
              text="Use your professional freedom to serve one another humbly in love, working remotely from the heart of Bologna."
            />
            <RoleCard
              icon={<Plane className="h-6 w-6" strokeWidth={1.75} />}
              title="One Year Challengers"
              text="If you have the savings and are willing to spend a year serving God on this planting, we'd love to have you!"
            />
          </div>
        </div>
      </section>

      {/* How to apply + Form */}
      <section id="form" className="container-prose py-20 md:py-28 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="eyebrow mb-5">How to apply</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Fill out the form on the right.
          </h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            If you feel called to join us, please complete the interest form. As
            part of the process, we'll ask for:
          </p>
          <ul className="mt-6 space-y-4 text-foreground/80">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                A short <strong>video introducing yourself</strong> and sharing why
                you want to participate in this planting.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                A <strong>letter of support</strong> from your current minister,
                elder, or church leadership.
              </span>
            </li>
          </ul>
          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <p className="text-sm text-foreground/70">
              Have further questions before applying? Reach out:
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
            <p className="eyebrow mb-5">Other ways to support</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              If moving isn't your path, you can still walk with us.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <SupportCard
              icon={<HandHeart className="h-6 w-6" strokeWidth={1.75} />}
              title="Pray"
              text="Starting a new church is bigger than any of our talents. Please pray that we can successfully get jobs, housing, and visas to be present. Pray that we develop a loving community and that God blesses us to share it with others."
            />
            <SupportCard
              icon={<Megaphone className="h-6 w-6" strokeWidth={1.75} />}
              title="Spread the word"
              text="Tell others about this church planting. Their prayers are precious too. And maybe, for one of them, this is just the opportunity God is moving them towards."
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
          <p className="eyebrow text-white/80 mb-4">A promise</p>
          <h2 className="font-display text-3xl md:text-5xl max-w-3xl mx-auto leading-tight italic">
            "No one lights a lamp and hides it under a bowl or puts it under a bed.
            Instead, he puts it on a lamp stand so that those who come in will see
            the light."
          </h2>
          <p className="mt-6 text-white/80">— Luke 8:16</p>
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

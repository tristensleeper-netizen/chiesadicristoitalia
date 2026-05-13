import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import daysData from "@/lib/isaia-days.json";

export const Route = createFileRoute("/milano/devozionale")({
  head: () => ({
    meta: [
      { title: "Lettura Devozionale — Isaia | Chiesa di Cristo di Milano" },
      {
        name: "description",
        content:
          "Studiare Isaia insieme: 66 giorni, 66 capitoli. Contesto, domande sul testo, domande per noi e ulteriori note per ogni capitolo.",
      },
    ],
  }),
  component: DevozionalePage,
});

type Day = {
  chapter: number;
  ref_label: string;
  title: string;
  contesto: string;
  domande_testo: string[];
  domande_noi: string[];
  note: string;
};

const DAYS = daysData as Day[];

function Paragraphs({ text }: { text: string }) {
  if (!text) return null;
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="text-foreground/80 leading-relaxed mb-4 last:mb-0">
          {p}
        </p>
      ))}
    </>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-7 md:p-9">
      <p className="eyebrow text-primary/70 mb-2">{eyebrow}</p>
      <h2 className="font-display text-2xl md:text-3xl text-primary mb-5">{title}</h2>
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </section>
  );
}

function DevozionalePage() {
  const [selected, setSelected] = useState(0);
  const day = DAYS[selected];

  const openDay = (idx: number) => {
    setSelected(idx);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document
          .getElementById("devozionale-contenuto")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container-prose py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/milano/" className="hover:text-primary transition">
            Milano
          </Link>
          <span>/</span>
          <span className="text-foreground">Lettura Devozionale</span>
        </div>
      </div>

      <div className="container-prose py-12 md:py-20">
        {/* HEADER */}
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Serie devozionale</p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Studiare Isaia insieme.
          </h1>
          <p className="mt-5 text-foreground/70 leading-relaxed text-lg">
            Un percorso attraverso il libro del profeta Isaia: 66 giorni, 66 capitoli — un capitolo
            per giorno. Per ogni capitolo trovi il contesto, le domande sul testo, le domande per
            noi e le ulteriori note.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-6">
            <p className="text-sm font-medium text-primary mb-1">Come usare questa serie</p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Scegli un capitolo qui sotto e leggilo prima nella tua Bibbia — quella è la Parola di
              Dio, queste note no. Poi torna qui per esplorare le domande e le note di studio.
            </p>
          </div>
        </div>

        {/* GRIGLIA 66 GIORNI */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="eyebrow">66 giorni · 66 capitoli</p>
            <p className="text-xs text-muted-foreground">
              Selezionato: Giorno {selected + 1} — Isaia {day.chapter}
            </p>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 gap-2">
            {DAYS.map((d, i) => {
              const isSel = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => openDay(i)}
                  aria-label={`Giorno ${i + 1} — Isaia ${d.chapter}`}
                  className={[
                    "aspect-square rounded-xl border flex flex-col items-center justify-center text-center select-none transition-all duration-150",
                    "hover:scale-105 active:scale-95 cursor-pointer",
                    isSel
                      ? "bg-primary text-primary-foreground border-primary shadow-md font-semibold"
                      : "bg-card border-border text-foreground hover:border-primary/40 hover:bg-[#f7ede2]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-[9px] uppercase tracking-wider leading-none",
                      isSel ? "text-white/70" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    Giorno
                  </span>
                  <span className="text-base md:text-lg font-bold leading-tight mt-0.5">
                    {i + 1}
                  </span>
                  <span
                    className={[
                      "text-[10px] leading-none mt-1",
                      isSel ? "text-white/80" : "text-primary/70",
                    ].join(" ")}
                  >
                    Is {d.chapter}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENUTO */}
        <div id="devozionale-contenuto" className="space-y-8 scroll-mt-24">
          {/* Intestazione capitolo */}
          <div className="rounded-3xl bg-primary p-8 md:p-12 text-white">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-3">
              Giorno {selected + 1} di 66 · {day.ref_label}
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight">{day.title}</h2>
          </div>

          {/* Sezione 1: Contesto */}
          {day.contesto && (
            <SectionCard eyebrow="Sezione 1" title="Contesto">
              <Paragraphs text={day.contesto} />
            </SectionCard>
          )}

          {/* Sezione 2: Domande sul testo */}
          {day.domande_testo.length > 0 && (
            <SectionCard eyebrow="Sezione 2" title="Domande sul testo">
              <ul className="space-y-4">
                {day.domande_testo.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-foreground/80 leading-relaxed">{q}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Sezione 3: Domande per noi */}
          {day.domande_noi.length > 0 && (
            <SectionCard eyebrow="Sezione 3" title="Domande per noi">
              <ul className="space-y-4">
                {day.domande_noi.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-foreground/80 leading-relaxed">{q}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Sezione 4: Ulteriori note */}
          {day.note && (
            <SectionCard eyebrow="Sezione 4" title="Ulteriori note">
              <Paragraphs text={day.note} />
            </SectionCard>
          )}

          {/* Navigazione */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => openDay(Math.max(0, selected - 1))}
              disabled={selected === 0}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Giorno precedente
            </button>
            <span className="text-xs text-muted-foreground">
              Giorno {selected + 1} / {DAYS.length}
            </span>
            <button
              onClick={() => openDay(Math.min(DAYS.length - 1, selected + 1))}
              disabled={selected === DAYS.length - 1}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Giorno successivo →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

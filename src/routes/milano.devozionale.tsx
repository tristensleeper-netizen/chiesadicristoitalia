import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import daysData from "@/lib/isaia-days.json";

export const Route = createFileRoute("/milano/devozionale")({
  head: () => ({
    meta: [
      { title: "Lettura Devozionale — Isaia | Chiesa di Cristo di Milano" },
      {
        name: "description",
        content:
          "Studiare Isaia insieme: 66 giorni, un capitolo al giorno. Scrittura, riflessioni, pratica e preghiera. Chiesa di Cristo di Milano.",
      },
    ],
  }),
  component: DevozionalePage,
});

type Day = {
  chapter: number;
  scripture: string;
  ref: string;
  title: string;
  intro: string;
  summary: string;
  questions: string[];
  practice: string[];
  prayer: string;
};

const DAYS = daysData as Day[];

// Inizio dello studio: lunedì 11 maggio 2026 — un capitolo per giorno (incl. weekend)
const START = new Date(2026, 4, 11);

const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MONTHS_SHORT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diffDays(a: Date, b: Date) {
  return Math.floor((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
}

function getTodayIndex(): number {
  const today = new Date();
  const idx = diffDays(today, START);
  if (idx < 0) return 0;
  if (idx >= DAYS.length) return DAYS.length - 1;
  return idx;
}

function mondayOf(date: Date) {
  const d = new Date(date);
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MONTHS_FULL = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

function DevozionalePage() {
  const todayIdx = getTodayIndex();
  const [selected, setSelected] = useState(todayIdx);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date(START);
    d.setDate(START.getDate() + todayIdx);
    return mondayOf(d);
  });
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Settimana visualizzata (Lun-Dom) basata su weekStart
  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const idx = diffDays(d, START);
      const within = idx >= 0 && idx < DAYS.length;
      return { date: d, idx, within, day: within ? DAYS[idx] : null };
    });
  }, [weekStart]);

  const shiftWeek = (delta: number) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(d);
  };

  const lastDay = new Date(START);
  lastDay.setDate(START.getDate() + DAYS.length - 1);
  const firstWeekStart = mondayOf(START);
  const lastWeekStart = mondayOf(lastDay);
  const canPrev = weekStart.getTime() > firstWeekStart.getTime();
  const canNext = weekStart.getTime() < lastWeekStart.getTime();

  const day = DAYS[selected];
  const weekLabel = `${week[0].date.getDate()} ${MONTHS_SHORT[week[0].date.getMonth()]} – ${week[6].date.getDate()} ${MONTHS_SHORT[week[6].date.getMonth()]} ${week[6].date.getFullYear()}`;

  // Mesi coperti dalla serie per il calendario completo
  const months = useMemo(() => {
    const result: { year: number; month: number }[] = [];
    const cur = new Date(START.getFullYear(), START.getMonth(), 1);
    const end = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1);
    while (cur.getTime() <= end.getTime()) {
      result.push({ year: cur.getFullYear(), month: cur.getMonth() });
      cur.setMonth(cur.getMonth() + 1);
    }
    return result;
  }, []);

  const openDay = (idx: number) => {
    setSelected(idx);
    const d = new Date(START);
    d.setDate(START.getDate() + idx);
    setWeekStart(mondayOf(d));
    setShowFullCalendar(false);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document.getElementById("devozionale-contenuto")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container-prose py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/milano/" className="hover:text-primary transition">Milano</Link>
          <span>/</span>
          <span className="text-foreground">Lettura Devozionale</span>
        </div>
      </div>

      <div className="container-prose py-12 md:py-20">
        {/* HEADER */}
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Serie devozionale</p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">Studiare Isaia insieme.</h1>
          <p className="mt-5 text-foreground/70 leading-relaxed text-lg">
            Un percorso di meditazione quotidiana attraverso il libro del profeta Isaia — 66 capitoli, 66 giorni, uno al giorno (sabato e domenica inclusi). Ogni giorno una scrittura, una riflessione, domande per la vita e una preghiera.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-6">
            <p className="text-sm font-medium text-primary mb-1">Obiettivo di questa serie</p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Isaia è uno dei libri più ricchi e complessi della Bibbia. Attraverso questa serie vogliamo aiutarti a leggere, comprendere e applicare la Parola di Dio alla tua vita concreta — scoprendo il carattere di Dio, il messaggio del Messia e come vivere una fede che trasforma davvero.
            </p>
          </div>
        </div>

        {/* CALENDARIO SETTIMANALE */}
        <div className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => shiftWeek(-1)}
                disabled={!canPrev}
                aria-label="Settimana precedente"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary hover:bg-[#f7ede2] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ←
              </button>
              <p className="eyebrow">Settimana del {weekLabel}</p>
              <button
                onClick={() => shiftWeek(1)}
                disabled={!canNext}
                aria-label="Settimana successiva"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary hover:bg-[#f7ede2] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                →
              </button>
            </div>
            <button
              onClick={() => setShowFullCalendar(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Calendario completo →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {week.map((w, i) => {
              const isSelected = w.within && w.idx === selected;
              const isToday = w.within && w.idx === todayIdx;
              return (
                <button
                  key={i}
                  onClick={() => w.within && setSelected(w.idx)}
                  disabled={!w.within}
                  className={[
                    "rounded-2xl border p-2 md:p-3 text-left transition-all duration-200 min-h-[88px]",
                    !w.within
                      ? "border-dashed border-border bg-muted/30 opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-primary/40 hover:bg-[#f7ede2]",
                  ].join(" ")}
                >
                  <p className={["text-[10px] font-medium uppercase tracking-wider mb-0.5", isSelected ? "text-white/70" : "text-muted-foreground"].join(" ")}>{WEEKDAY_SHORT[w.date.getDay()]}</p>
                  <p className={["text-sm font-semibold", isSelected ? "text-white" : "text-foreground"].join(" ")}>{w.date.getDate()} {MONTHS_SHORT[w.date.getMonth()]}</p>
                  {w.within ? (
                    <p className={["text-[10px] mt-1 leading-tight", isSelected ? "text-white/80" : "text-muted-foreground"].join(" ")}>
                      Isaia {w.day!.chapter}
                      {isToday && !isSelected && <span className="ml-1 text-primary font-semibold">• oggi</span>}
                    </p>
                  ) : (
                    <p className="text-[10px] mt-1 text-muted-foreground/70">—</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENUTO */}
        <div id="devozionale-contenuto" className="space-y-10 scroll-mt-24">
          {/* Scrittura */}
          <div className="rounded-3xl bg-primary p-8 md:p-10 text-white">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-4">Giorno {selected + 1} di 66 · Isaia {day.chapter}</p>
            <blockquote className="font-display text-2xl md:text-3xl leading-snug mb-4">
              {day.scripture}
            </blockquote>
            <cite className="text-sm text-white/70 not-italic font-medium">{day.ref}</cite>
          </div>

          {/* Riassunto */}
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
                  <line x1="12" y1="7" x2="12" y2="14"/><line x1="9" y1="10" x2="15" y2="10"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl text-primary">{day.title}</h2>
            </div>
            <p className="text-foreground/65 text-sm leading-relaxed mb-4 italic">{day.intro}</p>
            <div className="h-px w-full bg-border mb-5" />
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{day.summary}</p>
          </div>

          {/* Riflessione e pratica */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Domande di riflessione</h3>
              </div>
              <ul className="space-y-4">
                {day.questions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{i + 1}</span>
                    <p className="text-foreground/75 text-sm leading-relaxed">{q}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Metti in pratica</h3>
              </div>
              <ul className="space-y-4">
                {day.practice.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <p className="text-foreground/75 text-sm leading-relaxed">{p}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preghiera */}
          <div className="rounded-3xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 1l-6 4-6-4"/><circle cx="6" cy="8" r="3"/><circle cx="18" cy="8" r="3"/><circle cx="12" cy="18" r="3"/>
                  <line x1="8.6" y1="9.8" x2="10.2" y2="15.5"/><line x1="15.4" y1="9.8" x2="13.8" y2="15.5"/>
                </svg>
              </div>
              <h3 className="font-display text-xl text-primary">Preghiera del giorno</h3>
            </div>
            <p className="font-serif italic text-foreground/80 leading-relaxed text-lg">{day.prayer}</p>
          </div>

          {/* Navigazione */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => openDay(Math.max(0, selected - 1))}
              disabled={selected === 0}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Giorno precedente
            </button>
            <span className="text-xs text-muted-foreground">Giorno {selected + 1} / {DAYS.length}</span>
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

      {/* MODALE CALENDARIO COMPLETO */}
      {showFullCalendar && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowFullCalendar(false)}
        >
          <div
            className="relative bg-background rounded-3xl shadow-2xl max-w-4xl w-full my-8 p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="eyebrow mb-2">Calendario completo</p>
                <h2 className="font-display text-3xl text-primary">Studiare Isaia — 66 giorni</h2>
                <p className="text-sm text-foreground/60 mt-1">I giorni evidenziati sono parte della serie. Clicca su un giorno per aprirlo.</p>
              </div>
              <button
                onClick={() => setShowFullCalendar(false)}
                aria-label="Chiudi"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition text-foreground/70"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {months.map(({ year, month }) => {
                const firstOfMonth = new Date(year, month, 1);
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const leadDow = firstOfMonth.getDay();
                const leadBlanks = leadDow === 0 ? 6 : leadDow - 1;
                const cells: (number | null)[] = [
                  ...Array(leadBlanks).fill(null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];
                return (
                  <div key={`${year}-${month}`}>
                    <p className="font-display text-lg text-primary mb-3">{MONTHS_FULL[month]} {year}</p>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((d, i) => {
                        if (d === null) return <span key={i} className="aspect-square" />;
                        const date = new Date(year, month, d);
                        const idx = diffDays(date, START);
                        const inSeries = idx >= 0 && idx < DAYS.length;
                        const isSel = inSeries && idx === selected;
                        const isTod = inSeries && idx === todayIdx;
                        return (
                          <button
                            key={i}
                            onClick={() => inSeries && openDay(idx)}
                            disabled={!inSeries}
                            title={inSeries ? `Isaia ${DAYS[idx].chapter}` : undefined}
                            className={[
                              "aspect-square grid place-items-center text-xs rounded-lg transition",
                              !inSeries
                                ? "text-muted-foreground/40 cursor-default"
                                : isSel
                                ? "bg-primary text-primary-foreground font-semibold shadow"
                                : isTod
                                ? "bg-[#f7ede2] text-primary font-semibold ring-2 ring-primary/40 hover:bg-[#f0e4d6]"
                                : "bg-[#f7ede2] text-primary font-medium hover:bg-[#f0e4d6]",
                            ].join(" ")}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

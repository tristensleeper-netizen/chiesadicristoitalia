import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

export interface CourseDay {
  /** 0 = intro, 1..N = lessons */
  dayNumber: number;
  /** Short label, e.g. "Introduzione" or "Isaia 1" */
  label: string;
  /** Day title shown in the header */
  title: string;
  /** Optional reference like a scripture ref */
  refLabel?: string;
  /** Day content */
  content: React.ReactNode;
}

export interface CourseShellProps {
  courseId: string;
  courseTitle: string;
  courseSubtitle?: string;
  /** Breadcrumb crumbs, last is current page */
  breadcrumb?: Array<{ label: string; to?: string }>;
  /** Estimated read time per day in minutes */
  readMinutes?: number;
  days: CourseDay[];
}

function storageKey(courseId: string) {
  return `devozionale-${courseId}-progress`;
}

interface Progress {
  completed: number[]; // dayNumbers completed
  current: number; // current dayNumber
}

function loadProgress(courseId: string): Progress {
  if (typeof window === "undefined") return { completed: [], current: 0 };
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return { completed: [], current: 0 };
    const p = JSON.parse(raw) as Progress;
    return {
      completed: Array.isArray(p.completed) ? p.completed : [],
      current: typeof p.current === "number" ? p.current : 0,
    };
  } catch {
    return { completed: [], current: 0 };
  }
}

function saveProgress(courseId: string, p: Progress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(courseId), JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function CourseShell({
  courseId,
  courseTitle,
  courseSubtitle,
  breadcrumb = [],
  readMinutes = 5,
  days,
}: CourseShellProps) {
  const [progress, setProgress] = useState<Progress>({ completed: [], current: 0 });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setProgress(loadProgress(courseId));
  }, [courseId]);

  const current = useMemo(
    () => days.find((d) => d.dayNumber === progress.current) ?? days[0],
    [days, progress.current],
  );

  const goTo = useCallback(
    (dayNumber: number) => {
      const next = { ...progress, current: dayNumber };
      setProgress(next);
      saveProgress(courseId, next);
      setMobileNavOpen(false);
      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          document
            .getElementById("course-content")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [progress, courseId],
  );

  const markComplete = useCallback(() => {
    const completedSet = new Set(progress.completed);
    completedSet.add(current.dayNumber);
    const nextDay = days.find((d) => d.dayNumber > current.dayNumber);
    const next: Progress = {
      completed: Array.from(completedSet).sort((a, b) => a - b),
      current: nextDay ? nextDay.dayNumber : current.dayNumber,
    };
    setProgress(next);
    saveProgress(courseId, next);
    if (nextDay && typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document
          .getElementById("course-content")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [progress, current, days, courseId]);

  const completedCount = progress.completed.length;
  const total = days.length;
  const pct = Math.round((completedCount / total) * 100);

  const prevDay = useMemo(() => {
    const idx = days.findIndex((d) => d.dayNumber === current.dayNumber);
    return idx > 0 ? days[idx - 1] : null;
  }, [days, current]);
  const nextDay = useMemo(() => {
    const idx = days.findIndex((d) => d.dayNumber === current.dayNumber);
    return idx >= 0 && idx < days.length - 1 ? days[idx + 1] : null;
  }, [days, current]);

  const isCompleted = progress.completed.includes(current.dayNumber);
  const hasStarted = completedCount > 0 || progress.current !== 0;

  return (
    <>
      {/* Top progress bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-prose py-3">
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {breadcrumb.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {c.to ? (
                    <Link to={c.to} className="hover:text-primary transition">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{c.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span>›</span>}
                </span>
              ))}
              <span>›</span>
              <span className="text-foreground">
                Giorno {current.dayNumber} · {current.label}
              </span>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="lg:hidden text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/5"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? "Chiudi indice" : "Indice giorni"}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-foreground/70">
                  {completedCount} / {total} giorni completati
                </p>
                <p className="text-xs text-muted-foreground">{pct}%</p>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-prose py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Sidebar */}
          <aside
            className={[
              "lg:block",
              mobileNavOpen ? "block mb-8" : "hidden",
            ].join(" ")}
          >
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto rounded-2xl border border-border bg-card p-4">
              <div className="px-2 pt-1 pb-3 border-b border-border mb-3">
                <p className="eyebrow mb-1">Indice del corso</p>
                <h2 className="font-display text-lg text-foreground leading-tight">
                  {courseTitle}
                </h2>
                {!hasStarted && (
                  <p className="mt-3 text-xs text-foreground/70 bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] rounded-lg px-3 py-2">
                    <span className="font-medium text-primary">Inizia da qui →</span> Giorno{" "}
                    {days[0].dayNumber} è l'Introduzione.
                  </p>
                )}
              </div>
              <ul className="space-y-1">
                {days.map((d) => {
                  const isDone = progress.completed.includes(d.dayNumber);
                  const isCurrent = d.dayNumber === current.dayNumber;
                  return (
                    <li key={d.dayNumber}>
                      <button
                        onClick={() => goTo(d.dayNumber)}
                        className={[
                          "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-all",
                          isCurrent
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-foreground/75",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold border",
                            isDone
                              ? "bg-primary text-primary-foreground border-primary"
                              : isCurrent
                                ? "border-primary text-primary bg-background ring-2 ring-primary/20"
                                : "border-border text-foreground/60 bg-background",
                          ].join(" ")}
                        >
                          {isDone ? (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                              <path
                                fillRule="evenodd"
                                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            d.dayNumber
                          )}
                        </span>
                        <span className="truncate">{d.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div id="course-content" className="scroll-mt-32 min-w-0">
            {!hasStarted && current.dayNumber === days[0].dayNumber && (
              <div className="mb-8 rounded-2xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-5 md:p-6 flex items-start gap-4">
                <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">
                  {days[0].dayNumber}
                </span>
                <div>
                  <p className="font-medium text-primary text-sm md:text-base">
                    Giorno {days[0].dayNumber} è l'Introduzione — inizia da lì.
                  </p>
                  <p className="text-foreground/70 text-sm mt-1 leading-relaxed">
                    Leggi l'introduzione per inquadrare il percorso, poi procedi un giorno alla
                    volta. I tuoi progressi vengono salvati automaticamente.
                  </p>
                </div>
              </div>
            )}

            {/* Course title (top of main) */}
            {current.dayNumber === days[0].dayNumber && !hasStarted && (
              <div className="mb-10">
                <p className="eyebrow mb-3">Serie devozionale</p>
                <h1 className="font-display text-4xl md:text-5xl leading-tight">
                  {courseTitle}
                </h1>
                {courseSubtitle && (
                  <p className="mt-4 text-foreground/70 leading-relaxed text-lg max-w-2xl">
                    {courseSubtitle}
                  </p>
                )}
              </div>
            )}

            {/* Day header */}
            <header className="mb-8 pb-6 border-b border-border">
              <div className="flex items-baseline gap-5 mb-3">
                <span className="font-display text-6xl md:text-7xl text-foreground/15 leading-none tabular-nums">
                  {String(current.dayNumber).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="eyebrow mb-1">
                    Giorno {current.dayNumber}{current.refLabel ? ` · ${current.refLabel}` : ""}
                  </p>
                  <h1 className="font-display text-3xl md:text-4xl leading-tight text-foreground">
                    {current.title}
                  </h1>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ~{readMinutes} min di lettura
                {isCompleted && (
                  <span className="ml-3 inline-flex items-center gap-1 text-primary">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completato
                  </span>
                )}
              </p>
            </header>

            {/* Content */}
            <div className="space-y-8">{current.content}</div>

            {/* Bottom navigation */}
            <div className="mt-12 pt-8 border-t border-border space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={markComplete}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all",
                    isCompleted
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Completato {nextDay ? "— vai al prossimo" : ""}
                    </>
                  ) : (
                    <>Segna come completato {nextDay && "→"}</>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => prevDay && goTo(prevDay.dayNumber)}
                  disabled={!prevDay}
                  className="inline-flex flex-col items-start text-left text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline"
                >
                  <span className="text-xs text-muted-foreground">← Precedente</span>
                  {prevDay && (
                    <span className="font-medium truncate max-w-[10rem] sm:max-w-xs">
                      G{prevDay.dayNumber} · {prevDay.label}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => nextDay && goTo(nextDay.dayNumber)}
                  disabled={!nextDay}
                  className="inline-flex flex-col items-end text-right text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline"
                >
                  <span className="text-xs text-muted-foreground">Successivo →</span>
                  {nextDay && (
                    <span className="font-medium truncate max-w-[10rem] sm:max-w-xs">
                      G{nextDay.dayNumber} · {nextDay.label}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Helper hook to read course progress from localStorage (for cards on other pages). */
export function useCourseProgress(courseId: string, total: number) {
  const [pct, setPct] = useState(0);
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    const p = loadProgress(courseId);
    setCompleted(p.completed.length);
    setPct(Math.round((p.completed.length / total) * 100));
  }, [courseId, total]);
  return { pct, completed, total };
}

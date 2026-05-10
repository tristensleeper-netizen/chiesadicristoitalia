import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEventOccurrences, type EventOccurrence } from "@/lib/use-city-events";

interface Props {
  city: "milano" | "bologna";
  cityHref: string;
  ctaLabel?: string;
  /** How many weeks ahead the user can swipe through. */
  maxWeeksAhead?: number;
}

const ITALIAN_DAYS_FULL = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const ITALIAN_DAYS_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const ITALIAN_MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function EventsWeekCalendar({
  city,
  cityHref,
  ctaLabel = "Calendario completo",
  maxWeeksAhead = 7,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => startOfDay(new Date()), []);

  // Fetch a wide window once to cover all swipeable weeks.
  const { from, to } = useMemo(() => {
    const from = new Date(today);
    const to = new Date(today);
    to.setDate(to.getDate() + (maxWeeksAhead + 1) * 7);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }, [today, maxWeeksAhead]);

  const { occurrences } = useEventOccurrences(city, from, to);

  // Days for the currently visible week.
  const days = useMemo(() => {
    const start = new Date(today);
    start.setDate(start.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [today, weekOffset]);

  const byDay = useMemo(() => {
    const map = new Map<string, EventOccurrence[]>();
    for (const d of days) map.set(d.toDateString(), []);
    for (const occ of occurrences) {
      const key = startOfDay(occ.date).toDateString();
      const list = map.get(key);
      if (list) list.push(occ);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    return map;
  }, [occurrences, days]);

  // Month / range label
  const rangeLabel = useMemo(() => {
    const first = days[0];
    const last = days[days.length - 1];
    if (first.getMonth() === last.getMonth()) {
      return `${ITALIAN_MONTHS[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${ITALIAN_MONTHS[first.getMonth()]} – ${ITALIAN_MONTHS[last.getMonth()]} ${last.getFullYear()}`;
  }, [days]);

  const canPrev = weekOffset > 0;
  const canNext = weekOffset < maxWeeksAhead;

  const goPrev = () => canPrev && setWeekOffset((w) => w - 1);
  const goNext = () => canNext && setWeekOffset((w) => w + 1);

  // Swipe handling (touch + mouse drag)
  const dragRef = useRef<{ startX: number; active: boolean } | null>(null);
  const SWIPE_THRESHOLD = 50;

  const onPointerDown = (x: number) => {
    dragRef.current = { startX: x, active: true };
  };
  const onPointerUp = (x: number) => {
    if (!dragRef.current?.active) return;
    const dx = x - dragRef.current.startX;
    dragRef.current.active = false;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10 shadow-[var(--shadow-soft)]">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div
        className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Toolbar */}
      <div className="relative mb-6 flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Settimana precedente"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground/70 transition-all hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/60">
            {weekOffset === 0 ? "Questa settimana" : weekOffset === 1 ? "Prossima settimana" : `Tra ${weekOffset} settimane`}
          </p>
          <p className="font-display text-lg md:text-xl text-foreground mt-0.5">{rangeLabel}</p>
        </div>
        <button
          onClick={goNext}
          disabled={!canNext}
          aria-label="Settimana successiva"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground/70 transition-all hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Swipeable grid */}
      <div
        className="relative touch-pan-y select-none"
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={() => {
          if (dragRef.current) dragRef.current.active = false;
        }}
      >
        <div key={weekOffset} className="grid gap-3 md:grid-cols-7 animate-fade-in">
          {days.map((d) => {
            const list = byDay.get(d.toDateString()) ?? [];
            const isToday = isSameDay(d, today);
            return (
              <div
                key={d.toDateString()}
                className={
                  "rounded-2xl border p-4 transition-colors min-h-[140px] flex flex-col " +
                  (isToday
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 bg-background/40")
                }
              >
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                    <span className="md:hidden">{ITALIAN_DAYS_FULL[d.getDay()]}</span>
                    <span className="hidden md:inline">{ITALIAN_DAYS_SHORT[d.getDay()]}</span>
                  </p>
                  <p
                    className={
                      "font-display text-2xl leading-none " +
                      (isToday ? "text-primary" : "text-foreground/70")
                    }
                  >
                    {d.getDate()}
                  </p>
                </div>

                {list.length === 0 ? (
                  <p className="text-xs text-foreground/40 italic">—</p>
                ) : (
                  <ul className="space-y-2">
                    {list.map((occ) => {
                      const time = occ.date.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <li
                          key={occ.id}
                          className="rounded-lg bg-card border border-border/60 p-2 hover:border-primary/40 transition-colors"
                        >
                          <p className="text-[10px] font-medium text-primary tracking-wide">
                            {time}
                          </p>
                          <p className="text-xs font-medium text-foreground leading-snug mt-0.5 line-clamp-2">
                            {occ.title}
                          </p>
                          {occ.tag && (
                            <span className="mt-1 inline-block text-[9px] uppercase tracking-[0.18em] text-foreground/50">
                              {occ.tag}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Week dots */}
      <div className="relative mt-6 flex justify-center gap-1.5">
        {Array.from({ length: maxWeeksAhead + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setWeekOffset(i)}
            aria-label={`Settimana ${i + 1}`}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === weekOffset ? "w-8 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50")
            }
          />
        ))}
      </div>

      <div className="relative mt-6 flex justify-center">
        <Link to={cityHref} className="btn-primary whitespace-nowrap">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

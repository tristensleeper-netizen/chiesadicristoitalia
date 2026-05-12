import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEventOccurrences, type EventOccurrence } from "@/lib/use-city-events";

interface Props {
  city: "milano" | "bologna";
  cityHref: string;
  ctaLabel?: string;
  /** How many weeks ahead the user can swipe through. */
  maxWeeksAhead?: number;
  /** How many past weeks the user can swipe back to. */
  maxWeeksBack?: number;
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
  maxWeeksBack = 4,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  // Fetch a wide window covering past + future swipeable weeks.
  const { from, to } = useMemo(() => {
    const from = new Date(today);
    from.setDate(from.getDate() - (maxWeeksBack + 1) * 7);
    const to = new Date(today);
    to.setDate(to.getDate() + (maxWeeksAhead + 1) * 7);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }, [today, maxWeeksAhead, maxWeeksBack]);

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

  const rangeLabel = useMemo(() => {
    const first = days[0];
    const last = days[days.length - 1];
    if (first.getMonth() === last.getMonth()) {
      return `${ITALIAN_MONTHS[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${ITALIAN_MONTHS[first.getMonth()]} – ${ITALIAN_MONTHS[last.getMonth()]} ${last.getFullYear()}`;
  }, [days]);

  const canPrev = weekOffset > -maxWeeksBack;
  const canNext = weekOffset < maxWeeksAhead;

  const goPrev = () => canPrev && setWeekOffset((w) => w - 1);
  const goNext = () => canNext && setWeekOffset((w) => w + 1);

  const periodLabel =
    weekOffset === 0
      ? "Questa settimana"
      : weekOffset === 1
      ? "Prossima settimana"
      : weekOffset === -1
      ? "Settimana scorsa"
      : weekOffset > 0
      ? `Tra ${weekOffset} settimane`
      : `${Math.abs(weekOffset)} settimane fa`;

  // Swipe handling
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

  const totalDots = maxWeeksBack + maxWeeksAhead + 1;
  const dotIndex = weekOffset + maxWeeksBack;

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
          <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/60">{periodLabel}</p>
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
            const isPast = d < today && !isToday;
            const key = d.toDateString();
            const isPressed = pressedKey === key;
            const release = () => setPressedKey((k) => (k === key ? null : k));
            return (
              <div
                key={key}
                tabIndex={0}
                role="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                  setPressedKey(key);
                }}
                onPointerUp={release}
                onPointerLeave={release}
                onPointerCancel={release}
                className={
                  "relative rounded-2xl border p-4 min-h-[180px] flex flex-col cursor-pointer select-none " +
                  "transition-all duration-300 ease-out will-change-transform origin-center " +
                  (isPressed ? "z-30 shadow-2xl scale-[3] " : "hover:scale-[1.04] hover:shadow-[var(--shadow-soft)] hover:z-10 ") +
                  (isToday
                    ? "border-primary/40 bg-primary/5"
                    : isPast
                    ? "border-border/40 bg-background/20"
                    : "border-border/60 bg-background/40")
                }
              >
                <div className="flex items-baseline justify-between mb-3">
                  <p
                    className={
                      "text-[11px] uppercase tracking-[0.22em] " +
                      (isPast ? "text-foreground/40" : "text-foreground/60")
                    }
                  >
                    <span className={isPressed ? "" : "md:hidden"}>{ITALIAN_DAYS_FULL[d.getDay()]}</span>
                    {!isPressed && (
                      <span className="hidden md:inline">{ITALIAN_DAYS_SHORT[d.getDay()]}</span>
                    )}
                  </p>
                  <p
                    className={
                      "font-display text-2xl leading-none " +
                      (isToday
                        ? "text-primary"
                        : isPast
                        ? "text-foreground/40"
                        : "text-foreground/70")
                    }
                  >
                    {d.getDate()}
                  </p>
                </div>

                {list.length === 0 ? (
                  <p className="text-sm text-foreground/40 italic">Nessun evento</p>
                ) : (
                  <ul className="space-y-2.5 flex-1 divide-y divide-border/40">
                    {list.map((occ, idx) => {
                      const time = occ.date.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <li
                          key={occ.id}
                          className={
                            "min-w-0 " +
                            (idx > 0 ? "pt-2.5 " : "") +
                            (isPast ? "opacity-70" : "")
                          }
                        >
                          <p className="text-[11px] font-semibold text-primary tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                            {time}
                          </p>
                          <p className="text-[11px] font-medium text-foreground leading-snug mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            {occ.title}
                          </p>
                          {occ.location && (
                            <p className="mt-1 flex min-w-0 items-center gap-1 text-[10px] text-foreground/65 leading-snug whitespace-nowrap overflow-hidden">
                              <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                              <span className="min-w-0 overflow-hidden text-ellipsis">{occ.location}</span>
                            </p>
                          )}
                          {occ.tag && (
                            <span className="mt-1 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-foreground/55">
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
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => setWeekOffset(i - maxWeeksBack)}
            aria-label={`Settimana ${i + 1}`}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === dotIndex ? "w-8 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50")
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

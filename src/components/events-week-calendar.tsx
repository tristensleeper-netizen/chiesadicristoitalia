import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useEventOccurrences, type EventOccurrence } from "@/lib/use-city-events";

interface Props {
  city: "milano" | "bologna";
  cityHref: string;
  ctaLabel?: string;
}

const ITALIAN_DAYS_FULL = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const ITALIAN_DAYS_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

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

export function EventsWeekCalendar({ city, cityHref, ctaLabel = "Calendario completo" }: Props) {
  const { from, to, days, today } = useMemo(() => {
    const today = startOfDay(new Date());
    const from = today;
    const to = new Date(today);
    to.setDate(to.getDate() + 6);
    to.setHours(23, 59, 59, 999);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      days.push(d);
    }
    return { from, to, days, today };
  }, []);

  const { occurrences } = useEventOccurrences(city, from, to);

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

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10 shadow-[var(--shadow-soft)]">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div
        className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative grid gap-3 md:grid-cols-7">
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

      <div className="relative mt-8 flex justify-center">
        <Link to={cityHref} className="btn-primary whitespace-nowrap">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  isAfter,
  isSameMonth as _sm,
} from "date-fns";
import { it } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { useEventOccurrences, type EventOccurrence } from "@/lib/use-city-events";

interface Props {
  city: "milano" | "bologna";
}

export function EventsCalendar({ city }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(new Date());

  // Fetch a generous range so weekly recurrences materialize
  const rangeFrom = useMemo(() => startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }), [cursor]);
  const rangeTo = useMemo(() => endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }), [cursor]);

  const { occurrences, loading } = useEventOccurrences(city, rangeFrom, rangeTo);

  // Separate range for the "upcoming" list (next ~3 months from today)
  const upcomingFrom = useMemo(() => new Date(), []);
  const upcomingTo = useMemo(() => addMonths(upcomingFrom, 3), [upcomingFrom]);
  const { occurrences: upcoming } = useEventOccurrences(city, upcomingFrom, upcomingTo);
  const upcomingList = useMemo(
    () => upcoming.filter((o) => isAfter(o.end ?? o.date, new Date())).slice(0, 8),
    [upcoming],
  );

  const byDay = useMemo(() => {
    const m = new Map<string, EventOccurrence[]>();
    for (const occ of occurrences) {
      const key = format(occ.date, "yyyy-MM-dd");
      const list = m.get(key) ?? [];
      list.push(occ);
      m.set(key, list);
    }
    return m;
  }, [occurrences]);

  // Build the visible weeks
  const days = useMemo(() => {
    const list: Date[] = [];
    const d = new Date(rangeFrom);
    while (d <= rangeTo) {
      list.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return list;
  }, [rangeFrom, rangeTo]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : "";
  const selectedEvents = selected ? byDay.get(selectedKey) ?? [] : [];

  const weekdayLabels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  return (
    <div className="space-y-12">
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      {/* Calendar */}
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-[var(--shadow-soft)]">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCursor((c) => addMonths(c, -1))}
            className="h-10 w-10 grid place-items-center rounded-full border border-border hover:bg-muted transition"
            aria-label="Mese precedente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="font-display text-2xl capitalize">
            {format(cursor, "LLLL yyyy", { locale: it })}
          </h3>
          <button
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="h-10 w-10 grid place-items-center rounded-full border border-border hover:bg-muted transition"
            aria-label="Mese successivo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdayLabels.map((d) => (
            <div
              key={d}
              className="text-[11px] uppercase tracking-wider text-muted-foreground text-center font-medium py-2"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const events = byDay.get(key) ?? [];
            const inMonth = isSameMonth(d, cursor);
            const isSelected = selected && isSameDay(d, selected);
            const isToday = isSameDay(d, new Date());
            return (
              <button
                key={key}
                onClick={() => setSelected(d)}
                className={[
                  "aspect-square sm:aspect-auto sm:min-h-[88px] rounded-xl p-2 text-left transition border",
                  inMonth ? "" : "opacity-40",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-transparent hover:border-border hover:bg-muted/50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={[
                      "inline-grid place-items-center h-7 w-7 rounded-full text-sm",
                      isToday ? "bg-primary text-primary-foreground font-semibold" : "text-foreground",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </span>
                  {events.length > 0 && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      {events.length}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  {events.slice(0, 2).map((e) => (
                    <p
                      key={e.id}
                      className="text-[11px] leading-tight truncate text-foreground/70"
                      title={e.title}
                    >
                      • {e.title}
                    </p>
                  ))}
                  {events.length > 2 && (
                    <p className="text-[10px] text-muted-foreground">+{events.length - 2}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="text-xs text-muted-foreground mt-4 text-center">Caricamento eventi…</p>
        )}
      </div>

      {/* Selected day panel */}
      <aside className="rounded-3xl border border-border bg-background p-6 md:p-7">
        <p className="eyebrow mb-2">{selected ? "Eventi del giorno" : "Seleziona una data"}</p>
        <h3 className="font-display text-2xl mb-6 capitalize">
          {selected ? format(selected, "EEEE d LLLL", { locale: it }) : "—"}
        </h3>

        {selectedEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun evento in programma.</p>
        ) : (
          <ul className="space-y-5">
            {selectedEvents.map((e) => (
              <li key={e.id} className="border-l-2 border-primary pl-4">
                {e.tag && (
                  <span className="inline-block px-2 py-0.5 mb-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-primary/10 text-primary">
                    {e.tag}
                  </span>
                )}
                <h4 className="font-display text-lg leading-snug">{e.title}</h4>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(e.date, "HH:mm")}
                    {e.end ? ` – ${format(e.end, "HH:mm")}` : ""}
                  </span>
                  {e.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {e.location}
                    </span>
                  )}
                </div>
                {e.blurb && (
                  <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{e.blurb}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

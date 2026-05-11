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
                  "rounded-xl p-1.5 text-left transition border flex flex-col min-h-[80px]",
                  inMonth ? "" : "opacity-35",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-transparent hover:border-border hover:bg-muted/50",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-grid place-items-center h-6 w-6 rounded-full text-[11px] font-medium mb-1 shrink-0",
                    isToday ? "bg-primary text-primary-foreground font-semibold" : "text-foreground/80",
                  ].join(" ")}
                >
                  {d.getDate()}
                </span>

                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                  {events.slice(0, 2).map((e) => (
                    <div key={e.id} className="min-w-0">
                      <p className="text-[9px] leading-tight font-semibold text-primary truncate">
                        {format(e.date, "HH:mm")}
                      </p>
                      <p className="text-[9px] leading-tight text-foreground/75 truncate">
                        {e.title}
                      </p>
                      {e.location && (
                        <p className="text-[8px] leading-tight text-muted-foreground truncate">
                          {e.location}
                        </p>
                      )}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <p className="text-[8px] text-muted-foreground">+{events.length - 2}</p>
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

    {/* Upcoming events */}
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="eyebrow mb-2">In arrivo</p>
          <h3 className="font-display text-2xl">Prossimi eventi</h3>
        </div>
        <p className="text-xs text-muted-foreground">Prossimi 3 mesi</p>
      </div>
      {upcomingList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nessun evento in programma al momento.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {upcomingList.map((e) => (
            <li
              key={e.id}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] cursor-pointer"
              onClick={() => {
                setCursor(startOfMonth(e.date));
                setSelected(e.date);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center w-14">
                  <p className="font-display text-3xl leading-none text-primary">
                    {format(e.date, "d")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    {format(e.date, "LLL", { locale: it })}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  {e.tag && (
                    <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] uppercase tracking-[0.2em] rounded-full bg-primary/10 text-primary">
                      {e.tag}
                    </span>
                  )}
                  <h4 className="font-display text-lg leading-snug truncate">{e.title}</h4>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 capitalize">
                      <Clock className="h-3 w-3" />
                      {format(e.date, "EEE HH:mm", { locale: it })}
                    </span>
                    {e.location && (
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />
                        {e.location}
                      </span>
                    )}
                  </div>
                  {e.blurb && (
                    <p className="mt-2 text-sm text-foreground/70 leading-snug line-clamp-2">
                      {e.blurb}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}

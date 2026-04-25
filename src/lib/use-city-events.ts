import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RotatorEvent } from "@/components/events-rotator";

export type CityEventRow = {
  id: string;
  city: "milano" | "bologna" | "napoli" | "sicilia" | "national";
  kind: "recurring" | "special";
  title: string;
  blurb: string | null;
  tag: string | null;
  day_label: string | null;
  date_label: string | null;
  time_label: string | null;
  event_date: string | null;
  start_at: string | null;
  end_at: string | null;
  recurrence: "none" | "weekly";
  weekday: number | null;
  recurrence_end: string | null;
  location: string | null;
  sort_order: number;
  active: boolean;
};

/** A single concrete occurrence of an event on the calendar. */
export type EventOccurrence = {
  id: string; // unique per occurrence (event id + date)
  source: CityEventRow;
  date: Date;
  end?: Date;
  title: string;
  blurb: string;
  tag?: string;
  location?: string;
};

const ITALIAN_DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const ITALIAN_MONTHS = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
];

function formatDateLabel(d: Date) {
  return `${ITALIAN_DAYS[d.getDay()]} ${d.getDate()} ${ITALIAN_MONTHS[d.getMonth()]}`;
}

export function rowToRotator(r: CityEventRow): RotatorEvent {
  // Prefer real date if present
  if (r.start_at) {
    const d = new Date(r.start_at);
    const time = d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    return {
      date: formatDateLabel(d),
      time,
      title: r.title,
      blurb: r.blurb || "",
      tag: r.tag || undefined,
    };
  }
  const day = r.day_label?.trim() || "";
  const datePart = r.date_label?.trim() || "";
  return {
    date: `${day} ${datePart}`.trim() || "—",
    time: r.time_label || "",
    title: r.title,
    blurb: r.blurb || "",
    tag: r.tag || undefined,
  };
}

export function occurrenceToRotator(occ: EventOccurrence): RotatorEvent {
  const time = occ.date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  return {
    date: formatDateLabel(occ.date),
    time,
    title: occ.title,
    blurb: occ.blurb,
    tag: occ.tag,
  };
}

/** Expand a row into occurrences inside [from, to]. Multi-day events emit
 * one occurrence per day they span so each day is visible on the calendar. */
export function expandRow(r: CityEventRow, from: Date, to: Date): EventOccurrence[] {
  const out: EventOccurrence[] = [];
  const make = (
    date: Date,
    opts?: { dayIndex: number; dayCount: number },
  ): EventOccurrence => {
    const isMulti = (opts?.dayCount ?? 1) > 1;
    const suffix = isMulti && opts ? ` (giorno ${opts.dayIndex + 1}/${opts.dayCount})` : "";
    return {
      id: `${r.id}-${date.toISOString().slice(0, 10)}`,
      source: r,
      date,
      end: r.end_at ? new Date(r.end_at) : undefined,
      title: r.title + suffix,
      blurb: r.blurb || "",
      tag: r.tag || undefined,
      location: r.location || undefined,
    };
  };

  if (r.recurrence === "weekly" && r.weekday !== null && r.start_at) {
    const start = new Date(r.start_at);
    const recEnd = r.recurrence_end ? new Date(r.recurrence_end + "T23:59:59") : null;
    // Walk from max(start, from) through to
    const cursor = new Date(Math.max(from.getTime(), start.getTime()));
    cursor.setHours(start.getHours(), start.getMinutes(), 0, 0);
    // Move cursor forward to the next matching weekday
    while (cursor.getDay() !== r.weekday) {
      cursor.setDate(cursor.getDate() + 1);
    }
    while (cursor <= to) {
      if (recEnd && cursor > recEnd) break;
      out.push(make(new Date(cursor)));
      cursor.setDate(cursor.getDate() + 7);
    }
    return out;
  }

  if (r.start_at) {
    const startDt = new Date(r.start_at);
    const endDt = r.end_at ? new Date(r.end_at) : null;

    // Compute inclusive day count (calendar days the event spans)
    const startDay = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate());
    const endDayBase = endDt ? new Date(endDt.getFullYear(), endDt.getMonth(), endDt.getDate()) : startDay;
    const endDay = endDayBase < startDay ? startDay : endDayBase;
    const dayCount = Math.round((endDay.getTime() - startDay.getTime()) / 86400000) + 1;

    for (let i = 0; i < dayCount; i++) {
      const dayDate = new Date(startDay);
      dayDate.setDate(startDay.getDate() + i);
      // First day keeps the actual start time so it sorts correctly; later
      // days appear at the start of the day on the calendar.
      if (i === 0) {
        dayDate.setHours(startDt.getHours(), startDt.getMinutes(), 0, 0);
      } else {
        dayDate.setHours(9, 0, 0, 0);
      }
      if (dayDate >= from && dayDate <= to) {
        out.push(make(dayDate, { dayIndex: i, dayCount }));
      }
    }
    return out;
  }
  return out;
}

export function useCityEvents(city: "milano" | "bologna", fallback: RotatorEvent[]) {
  const [events, setEvents] = useState<RotatorEvent[]>(fallback);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("city_events")
        .select("*")
        .eq("city", city)
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("start_at", { ascending: true, nullsFirst: false })
        .order("event_date", { ascending: true, nullsFirst: false });
      if (error || !active) return;
      if (data && data.length > 0) {
        setEvents((data as CityEventRow[]).map(rowToRotator));
      }
    })();
    return () => {
      active = false;
    };
  }, [city]);

  return events;
}

/** Fetches raw city events (used by the calendar view). */
export function useCityEventRows(city: "milano" | "bologna") {
  const [rows, setRows] = useState<CityEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("city_events")
        .select("*")
        .eq("city", city)
        .eq("active", true);
      if (!active) return;
      setRows((data as CityEventRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [city]);

  return { rows, loading };
}

/** Returns occurrences expanded across the given range. */
export function useEventOccurrences(city: "milano" | "bologna", from: Date, to: Date) {
  const { rows, loading } = useCityEventRows(city);
  const occurrences = useMemo(() => {
    const all: EventOccurrence[] = [];
    for (const r of rows) all.push(...expandRow(r, from, to));
    all.sort((a, b) => a.date.getTime() - b.date.getTime());
    return all;
  }, [rows, from, to]);
  return { occurrences, loading };
}

export function useActiveHero(city: "milano" | "bologna", fallback: string) {
  const [hero, setHero] = useState<string>(fallback);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("hero_images")
        .select("public_url")
        .eq("city", city)
        .eq("is_active", true)
        .maybeSingle();
      if (!active) return;
      if (data?.public_url) setHero(data.public_url);
    })();
    return () => {
      active = false;
    };
  }, [city]);

  return hero;
}

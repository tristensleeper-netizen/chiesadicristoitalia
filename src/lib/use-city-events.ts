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

/** Per-date override for a recurring (or single) event. */
export type EventOverrideRow = {
  id: string;
  event_id: string;
  override_date: string; // YYYY-MM-DD
  cancelled: boolean;
  title: string | null;
  blurb: string | null;
  time_label: string | null;
  location: string | null;
  start_at: string | null;
  end_at: string | null;
  note: string | null;
};

function isoDay(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

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
export function expandRow(
  r: CityEventRow,
  from: Date,
  to: Date,
  overrides?: EventOverrideRow[],
): EventOccurrence[] {
  const out: EventOccurrence[] = [];
  const ovrByDate = new Map<string, EventOverrideRow>();
  for (const o of overrides ?? []) {
    if (o.event_id === r.id) ovrByDate.set(o.override_date, o);
  }

  const make = (
    date: Date,
    opts?: { dayIndex: number; dayCount: number },
  ): EventOccurrence | null => {
    const ovr = ovrByDate.get(isoDay(date));
    if (ovr?.cancelled) return null;

    let finalDate = date;
    let endDate: Date | undefined = r.end_at ? new Date(r.end_at) : undefined;
    if (ovr?.start_at) {
      finalDate = new Date(ovr.start_at);
    }
    if (ovr?.end_at) {
      endDate = new Date(ovr.end_at);
    }

    const isMulti = (opts?.dayCount ?? 1) > 1;
    const suffix = isMulti && opts ? ` (giorno ${opts.dayIndex + 1}/${opts.dayCount})` : "";
    const baseTitle = ovr?.title || r.title;
    const baseBlurb = ovr?.blurb ?? r.blurb ?? "";
    const blurbWithNote = ovr?.note ? `${ovr.note}${baseBlurb ? ` — ${baseBlurb}` : ""}` : baseBlurb;
    return {
      id: `${r.id}-${isoDay(finalDate)}`,
      source: r,
      date: finalDate,
      end: endDate,
      title: baseTitle + suffix,
      blurb: blurbWithNote,
      tag: r.tag || undefined,
      location: ovr?.location || r.location || undefined,
    };
  };

  if (r.recurrence === "weekly" && r.weekday !== null && r.start_at) {
    const start = new Date(r.start_at);
    const recEnd = r.recurrence_end ? new Date(r.recurrence_end + "T23:59:59") : null;
    const cursor = new Date(Math.max(from.getTime(), start.getTime()));
    cursor.setHours(start.getHours(), start.getMinutes(), 0, 0);
    while (cursor.getDay() !== r.weekday) {
      cursor.setDate(cursor.getDate() + 1);
    }
    while (cursor <= to) {
      if (recEnd && cursor > recEnd) break;
      const occ = make(new Date(cursor));
      if (occ) out.push(occ);
      cursor.setDate(cursor.getDate() + 7);
    }
    return out;
  }

  if (r.start_at) {
    const startDt = new Date(r.start_at);
    const endDt = r.end_at ? new Date(r.end_at) : null;

    const startDay = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate());
    const endDayBase = endDt ? new Date(endDt.getFullYear(), endDt.getMonth(), endDt.getDate()) : startDay;
    const endDay = endDayBase < startDay ? startDay : endDayBase;
    const dayCount = Math.round((endDay.getTime() - startDay.getTime()) / 86400000) + 1;

    for (let i = 0; i < dayCount; i++) {
      const dayDate = new Date(startDay);
      dayDate.setDate(startDay.getDate() + i);
      if (i === 0) {
        dayDate.setHours(startDt.getHours(), startDt.getMinutes(), 0, 0);
      } else {
        dayDate.setHours(9, 0, 0, 0);
      }
      if (dayDate >= from && dayDate <= to) {
        const occ = make(dayDate, { dayIndex: i, dayCount });
        if (occ) out.push(occ);
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
        const rows = data as CityEventRow[];
        // Window: from start of today through next 7 days
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const to = new Date(from);
        to.setDate(to.getDate() + 7);
        to.setHours(23, 59, 59, 999);

        const occurrences: EventOccurrence[] = [];
        for (const r of rows) occurrences.push(...expandRow(r, from, to));
        // Drop occurrences already in the past today
        const upcoming = occurrences
          .filter((o) => o.date.getTime() >= now.getTime() || isSameDay(o.date, now))
          .filter((o) => o.date.getTime() >= now.getTime() - 60 * 60 * 1000) // small grace for in-progress
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (upcoming.length > 0) {
          setEvents(upcoming.map(occurrenceToRotator));
        } else {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [city]);

  return events;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

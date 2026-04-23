import { useEffect, useState } from "react";
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
  sort_order: number;
  active: boolean;
};

export function rowToRotator(r: CityEventRow): RotatorEvent {
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

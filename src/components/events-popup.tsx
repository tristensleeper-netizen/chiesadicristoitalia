import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Calendar } from "lucide-react";
import type { RotatorEvent } from "./events-rotator";

interface Props {
  events: RotatorEvent[];
  cityHref: string;
  cityName: string;
}

export function EventsPopup({ events, cityHref, cityName }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  // Slide in after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Rotate events
  useEffect(() => {
    if (events.length <= 1 || dismissed) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, 5000);
    return () => clearInterval(id);
  }, [events.length, dismissed]);

  if (dismissed || events.length === 0) return null;
  const current = events[index];

  return (
    <div
      className={
        "fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm transition-all duration-700 ease-out " +
        (visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none")
      }
      role="complementary"
      aria-label={`Prossimi eventi a ${cityName}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl animate-float" />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-accent/20 blur-2xl animate-float"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/60">
              Cosa succede · {cityName}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Chiudi"
            className="rounded-full p-1 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div key={index} className="relative px-5 py-4 animate-fade-up">
          <div className="flex items-baseline gap-3">
            <p className="font-display text-3xl leading-none text-primary">
              {current.date.split(" ")[1]}
            </p>
            <p className="font-display text-sm text-foreground/60">
              {current.date.split(" ")[0]} {current.date.split(" ")[2] ?? ""} · {current.time}
            </p>
          </div>
          <h3 className="font-display mt-2 text-lg leading-tight text-foreground">
            {current.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-foreground/70">
            {current.blurb}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <Link
              to={cityHref}
              className="text-xs font-medium text-primary hover:underline"
            >
              Tutti gli eventi →
            </Link>
            <div className="flex gap-1.5">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Evento ${i + 1}`}
                  className={
                    "h-1 rounded-full transition-all " +
                    (i === index ? "w-6 bg-primary" : "w-1 bg-primary/25 hover:bg-primary/50")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

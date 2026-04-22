import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export type RotatorEvent = {
  date: string; // e.g. "Dom 27 Apr"
  time: string; // e.g. "11:00"
  title: string;
  blurb: string;
  tag?: string;
};

interface Props {
  events: RotatorEvent[];
  cityHref: string;
  ctaLabel?: string;
}

export function EventsRotator({ events, cityHref, ctaLabel = "Tutti gli eventi" }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, 4500);
    return () => clearInterval(id);
  }, [events.length]);

  const current = events[index];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 shadow-[var(--shadow-soft)]">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="text-center md:text-left">
          <p className="eyebrow mb-2">Prossimo</p>
          <p className="font-display text-5xl md:text-6xl text-primary leading-none">
            {current.date.split(" ")[1]}
          </p>
          <p className="font-display text-xl text-foreground/70 mt-1">
            {current.date.split(" ")[0]} · {current.time}
          </p>
        </div>

        <div key={index} className="animate-fade-up">
          {current.tag && (
            <span className="inline-block px-3 py-1 mb-3 text-[10px] uppercase tracking-[0.25em] rounded-full bg-primary/10 text-primary">
              {current.tag}
            </span>
          )}
          <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
            {current.title}
          </h3>
          <p className="mt-3 text-foreground/70 leading-relaxed max-w-xl">{current.blurb}</p>
        </div>

        <Link to={cityHref} className="btn-primary self-center whitespace-nowrap">
          {ctaLabel}
        </Link>
      </div>

      {/* Progress dots */}
      <div className="relative mt-8 flex justify-center gap-2">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Evento ${i + 1}`}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === index ? "w-10 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50")
            }
          />
        ))}
      </div>
    </div>
  );
}

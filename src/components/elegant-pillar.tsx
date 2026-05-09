import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;

export interface ElegantPillarProps {
  index: number;
  eyebrow?: string;
  title: string;
  text: string;
  cta: { to: string; label: string };
}

export function ElegantPillar({ index, eyebrow, title, text, cta }: ElegantPillarProps) {
  const numeral = NUMERALS[index] ?? String(index + 1);
  return (
    <Link
      to={cta.to}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-card/70 hover:shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
    >
      {/* Filigree numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[8rem] leading-none text-primary/[0.06] transition-all duration-700 group-hover:text-primary/[0.12] group-hover:-translate-y-1"
      >
        {numeral}
      </span>

      {/* Top hairline that grows on hover */}
      <span
        aria-hidden
        className="absolute left-8 right-8 top-0 h-px origin-left scale-x-50 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent transition-transform duration-700 group-hover:scale-x-100"
      />

      <div className="relative flex items-center gap-3">
        <span className="font-display text-sm tracking-[0.3em] text-primary/70">{numeral}</span>
        <span className="h-px w-8 bg-primary/30" />
        {eyebrow && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/50">{eyebrow}</span>
        )}
      </div>

      <h3 className="relative mt-6 font-display text-2xl leading-tight text-foreground">{title}</h3>
      <p className="relative mt-4 text-[15px] leading-relaxed text-foreground/70">{text}</p>

      <div className="relative mt-8 flex items-center justify-between pt-6 border-t border-border/60">
        <span className="text-sm font-medium text-primary">{cta.label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-primary transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}

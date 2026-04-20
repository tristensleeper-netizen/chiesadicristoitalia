import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface PageHeroProps {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primaryCta?: { to: string; label: string };
  secondaryCta?: { to: string; label: string };
  align?: "center" | "left";
  height?: "tall" | "medium" | "short";
}

export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align = "center",
  height = "tall",
}: PageHeroProps) {
  const heightClass =
    height === "tall"
      ? "min-h-[88vh]"
      : height === "medium"
        ? "min-h-[60vh]"
        : "min-h-[42vh]";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section className={`relative -mt-[72px] flex ${heightClass} w-full overflow-hidden`}>
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1280}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 35%, transparent) 0%, color-mix(in oklab, var(--primary) 78%, transparent) 100%)",
        }}
      />
      <div className={`relative z-10 container-prose flex w-full flex-col justify-end pb-20 pt-40 ${alignClass}`}>
        {eyebrow && (
          <p className="eyebrow text-white/80 mb-5">{eyebrow}</p>
        )}
        <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className={`mt-10 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
            {primaryCta && (
              <Link to={primaryCta.to} className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:shadow-xl">
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link to={secondaryCta.to} className="btn-ghost-light">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

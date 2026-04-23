import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useSlotMedia, type SlotKey } from "@/lib/use-slot-image";

interface PageHeroProps {
  image: string;
  videoSrc?: string;
  /** Optional slot key — when set, renders the assigned image or video for that slot. */
  slot?: SlotKey;
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
  videoSrc,
  slot,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align = "center",
  height = "tall",
}: PageHeroProps) {
  const slotMedia = useSlotMedia(slot ?? ("home.hero" as SlotKey));
  const useSlot = slot != null && slotMedia != null;

  // Resolve final media source
  const resolvedVideo =
    videoSrc ??
    (useSlot && slotMedia.kind === "video" && !slotMedia.external_url
      ? slotMedia.url
      : undefined);
  const resolvedImage =
    useSlot && slotMedia.kind === "image"
      ? slotMedia.url
      : useSlot && slotMedia.thumbnail_url
        ? slotMedia.thumbnail_url
        : image;

  const heightClass =
    height === "tall"
      ? "min-h-[88vh]"
      : height === "medium"
        ? "min-h-[60vh]"
        : "min-h-[42vh]";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section className={`relative -mt-[72px] flex ${heightClass} w-full overflow-hidden`}>
      {resolvedVideo ? (
        <video
          src={resolvedVideo}
          poster={resolvedImage}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={resolvedImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            align === "left"
              ? "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div className={`relative z-10 container-prose flex w-full flex-col justify-end pb-14 pt-32 ${alignClass}`}>
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

import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
  /** When true, applies a vivid colorful overlay and pushes the media into the background. */
  vivid?: boolean;
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
  vivid = false,
}: PageHeroProps) {
  const slotMedia = useSlotMedia(slot ?? ("home.hero" as SlotKey));
  const useSlot = slot != null && slotMedia != null;
  // While a slot is specified but not yet loaded, suppress the fallback image
  // to avoid a flash of the default hero before the video appears.
  const slotPending = slot != null && slotMedia == null;
  const [videoReady, setVideoReady] = useState(false);
  const hasVerticalMedia = useSlot && slotMedia.width && slotMedia.height
    ? slotMedia.height > slotMedia.width
    : false;

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
  // Poster shown beneath the video while it buffers (prevents blank background flash).
  const videoPoster =
    useSlot && slotMedia.kind === "video" && slotMedia.thumbnail_url
      ? slotMedia.thumbnail_url
      : image;
  // Only render the still image layer when there's no video AND the slot isn't pending.
  const showImageLayer = !resolvedVideo && !slotPending;
  // When the slot has a video, never render the fallback image at all (prevents flash).
  const slotHasVideo = useSlot && slotMedia.kind === "video";

  const heightClass =
    height === "tall"
      ? "min-h-[88vh]"
      : height === "medium"
        ? "min-h-[60vh]"
        : "min-h-[42vh]";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section
      className={`page-hero-shell relative -mt-[72px] flex ${heightClass} w-full overflow-hidden bg-foreground`}
      style={resolvedVideo ? { backgroundImage: `url(${videoPoster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {hasVerticalMedia && (
        <>
          {resolvedVideo ? (
            <video
              src={resolvedVideo}
              poster={resolvedImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-2xl"
            />
          ) : (
            <img
              src={resolvedImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-2xl"
              width={1920}
              height={1280}
            />
          )}
        </>
      )}
      {resolvedVideo ? (
        <video
          src={resolvedVideo}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${hasVerticalMedia ? "object-contain" : "object-cover"} ${vivid ? "hero-home-video scale-105" : ""} ${videoReady ? "opacity-100" : "opacity-0"}`}
        />
      ) : showImageLayer && !slotHasVideo ? (
        <img
          src={resolvedImage}
          alt=""
          className={`absolute inset-0 h-full w-full ${hasVerticalMedia ? "object-contain" : "object-cover"} ${vivid ? "hero-home-video scale-105" : ""}`}
          width={1920}
          height={1280}
        />
      ) : null}
      <div className={`${vivid ? "hero-home-vivid" : "hero-cinematic-overlay"} absolute inset-0 ${align === "left" && !vivid ? "hero-cinematic-overlay-left" : ""}`} />
      <div className="hero-film-grain absolute inset-0" aria-hidden="true" />
      <div className="hero-bottom-glow absolute inset-x-0 bottom-0 h-40" aria-hidden="true" />
      <div className={`relative z-10 container-prose flex w-full flex-col justify-end pb-14 pt-32 md:pb-18 ${alignClass}`}>
        {eyebrow && (
          <p className="hero-eyebrow mb-5 animate-fade-up">{eyebrow}</p>
        )}
        <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p className="hero-subtitle mt-6 max-w-2xl text-base md:text-lg leading-relaxed animate-fade-up">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className={`mt-10 flex flex-wrap gap-3 animate-fade-up ${align === "center" ? "justify-center" : ""}`}>
            {primaryCta && (
              <Link to={primaryCta.to} className="hero-primary-cta inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium transition-all hover:-translate-y-0.5">
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link to={secondaryCta.to} className="hero-secondary-cta inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-all">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

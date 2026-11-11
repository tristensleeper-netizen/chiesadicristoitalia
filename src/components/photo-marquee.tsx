import { useState } from "react";

interface Props {
  images: { src: string; alt: string }[];
  reverse?: boolean;
  speed?: "slow" | "normal";
}

export function PhotoMarquee({ images, reverse = false, speed = "normal" }: Props) {
  const [paused, setPaused] = useState(false);
  const items = [...images, ...images];
  const animClass = reverse
    ? "animate-marquee-reverse"
    : speed === "slow"
      ? "animate-marquee-slow"
      : "animate-marquee";
  return (
    <div className="relative">
      <div className="group overflow-hidden marquee-mask py-2 motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <div
          className={
            "flex gap-6 w-max motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] " +
            animClass
          }
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {items.map((img, i) => (
            <div
              key={i}
              aria-hidden={i >= images.length ? true : undefined}
              className={
                "relative h-72 w-96 shrink-0 overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]" +
                (i >= images.length ? " motion-reduce:hidden" : "")
              }
            >
              <img
                src={img.src}
                alt={i >= images.length ? "" : img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="container-prose mt-3 flex justify-end motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Riproduci lo scorrimento delle foto" : "Metti in pausa lo scorrimento delle foto"}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium text-foreground/80 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {paused ? "▶ Riproduci" : "❚❚ Pausa"}
        </button>
      </div>
    </div>
  );
}

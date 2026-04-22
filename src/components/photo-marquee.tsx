interface Props {
  images: { src: string; alt: string }[];
  reverse?: boolean;
  speed?: "slow" | "normal";
}

export function PhotoMarquee({ images, reverse = false, speed = "normal" }: Props) {
  const items = [...images, ...images];
  const animClass = reverse
    ? "animate-marquee-reverse"
    : speed === "slow"
      ? "animate-marquee-slow"
      : "animate-marquee";
  return (
    <div className="overflow-hidden marquee-mask py-2">
      <div className={"flex gap-6 w-max " + animClass}>
        {items.map((img, i) => (
          <div
            key={i}
            className="relative h-72 w-96 shrink-0 overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type Verse = { text: string; ref: string };

interface Props {
  verses?: Verse[];
  reverse?: boolean;
}

const DEFAULT_VERSES: Verse[] = [
  { text: "L'Eterno è il mio pastore, nulla mi mancherà", ref: "Salmo 23:1" },
  { text: "Venite a me, voi tutti che siete affaticati", ref: "Matteo 11:28" },
  { text: "Dio è amore", ref: "1 Giovanni 4:8" },
  { text: "Cercate prima il regno di Dio", ref: "Matteo 6:33" },
  { text: "Io sono la via, la verità e la vita", ref: "Giovanni 14:6" },
  { text: "Ogni cosa coopera al bene di quelli che amano Dio", ref: "Romani 8:28" },
];

export function ScriptureMarquee({ verses = DEFAULT_VERSES, reverse = false }: Props) {
  const items = [...verses, ...verses];
  return (
    <div className="bg-primary text-primary-foreground py-6 overflow-hidden marquee-mask">
      <div className={"flex gap-16 whitespace-nowrap w-max " + (reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="font-display italic text-2xl md:text-3xl">"{v.text}"</span>
            <span className="text-xs uppercase tracking-[0.3em] opacity-70">{v.ref}</span>
            <span className="text-primary-foreground/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstagramFeed({ handle, city }: { handle: string; city: string }) {
  const url = `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
  return (
    <section className="container-prose py-16 md:py-20">
      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div>
          <p className="eyebrow mb-3">In comunità · {city}</p>
          <h2 className="font-display text-3xl md:text-4xl">Seguici su Instagram</h2>
          <p className="mt-3 text-foreground/70">
            Foto e momenti della vita della chiesa. <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@{handle.replace(/^@/, "")}</a>
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Apri Instagram →
        </a>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary/40 hover:from-primary/20 hover:to-primary/40 transition-colors"
            aria-label={`Apri Instagram di ${handle}`}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground text-center">
        Connetti il tuo account per mostrare i post più recenti automaticamente.
      </p>
    </section>
  );
}

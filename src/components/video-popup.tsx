import { useEffect, useState } from "react";
import { X, Play } from "lucide-react";

interface Props {
  videoUrl: string;
  title: string;
  eyebrow?: string;
  duration?: string;
  /** Delay before sliding in (ms) */
  delayMs?: number;
  /** Storage key for session-level dismissal */
  storageKey?: string;
}

function getYouTubeId(url: string) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

export function VideoPopup({
  videoUrl,
  title,
  eyebrow = "Guardaci",
  duration = "2 min",
  delayMs = 2200,
  storageKey = "video-popup-dismissed",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  // Mount: check sessionStorage, then slide in
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      // ignore
    }
    setDismissed(false);
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, storageKey]);

  if (dismissed) return null;

  const ytId = getYouTubeId(videoUrl);
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
    setTimeout(() => setDismissed(true), 350);
  };

  return (
    <div
      className={
        "fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-xs transition-all duration-700 ease-out " +
        (visible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0 pointer-events-none")
      }
      role="complementary"
      aria-label="Video in evidenza"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Close */}
        <button
          onClick={close}
          aria-label="Chiudi"
          className="absolute right-2 top-2 z-20 rounded-full bg-black/40 p-1 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-black/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Guarda il video: ${title}`}
          className="group block"
        >
          {/* Thumb */}
          <div className="relative aspect-video w-full overflow-hidden bg-primary">
            {thumb && (
              <img
                src={thumb}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30"
            />

            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              YouTube
            </span>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-white/30 blur-xl transition-all duration-500 group-hover:bg-red-500/50 group-hover:scale-125"
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 ring-1 ring-white/60 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-red-600">
                  <Play
                    className="h-5 w-5 translate-x-0.5 fill-primary text-primary transition-colors duration-500 group-hover:fill-white group-hover:text-white"
                    strokeWidth={0}
                  />
                </div>
              </div>
            </div>

            <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md ring-1 ring-white/15">
              {duration}
            </span>
          </div>

          {/* Caption */}
          <div className="px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/55">
              {eyebrow}
            </p>
            <p className="mt-1 font-display text-sm leading-snug text-foreground line-clamp-2">
              {title}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Guarda ora <span aria-hidden>→</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}

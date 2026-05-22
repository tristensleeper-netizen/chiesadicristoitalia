import { useEffect, useState } from "react";
import { X, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  videoUrl: string;
  title: string;
  eyebrow?: string;
  duration?: string;
  /** Delay before sliding in (ms) */
  delayMs?: number;
  /** Storage key for session-level dismissal */
  storageKey?: string;
  /** Slug of the resource page to link to via "Guarda ora" */
  slug?: string;
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
  slug,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [open, setOpen] = useState(false);

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

  // Lock body scroll while lightbox is open + close on Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ytId = getYouTubeId(videoUrl);
  const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;
  const embedSrc = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
    : undefined;

  const closePopup = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
    setTimeout(() => setDismissed(true), 350);
  };

  return (
    <>
      {!dismissed && (
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
            <button
              onClick={closePopup}
              aria-label="Chiudi"
              className="absolute right-2 top-2 z-20 rounded-full bg-black/40 p-1 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-black/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Thumbnail opens lightbox */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Guarda il video: ${title}`}
              className="group block w-full text-left"
            >
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
            </button>

            {/* Text + CTA */}
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                {eyebrow}
              </p>
              <p className="mt-1 font-display text-sm leading-snug text-foreground line-clamp-2">
                {title}
              </p>
              {slug ? (
                <Link
                  to="/risorse/$slug"
                  params={{ slug }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  onClick={closePopup}
                >
                  Guarda ora <span aria-hidden>→</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"
                >
                  Guarda ora <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {open && embedSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Chiudi video"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

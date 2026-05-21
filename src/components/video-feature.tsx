import { Play, ArrowUpRight } from "lucide-react";

export interface VideoItem {
  videoUrl: string;
  title?: string;
  description?: string;
  duration?: string;
}

interface VideoFeatureProps {
  /** Single video (legacy) */
  videoUrl?: string;
  /** Rotating list — one is chosen per ISO week */
  videos?: VideoItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  duration?: string;
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** ISO week — deterministic across server & client (UTC based, no hydration mismatch) */
function getIsoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function VideoFeature({
  videoUrl,
  videos,
  eyebrow = "Guardaci",
  title,
  description,
  duration = "2 min",
}: VideoFeatureProps) {
  // Pick this week's video deterministically
  const pool: VideoItem[] =
    videos && videos.length > 0
      ? videos
      : videoUrl
        ? [{ videoUrl, title, description, duration }]
        : [];

  const now = new Date();
  const weekIndex = getIsoWeek(now) + now.getUTCFullYear() * 53;
  const selected = pool[weekIndex % Math.max(pool.length, 1)] ?? { videoUrl: "", title, description, duration };

  const activeUrl = selected.videoUrl;
  const activeTitle = selected.title ?? title;
  const activeDescription = selected.description ?? description;
  const activeDuration = selected.duration ?? duration;

  const ytId = activeUrl ? getYouTubeId(activeUrl) : null;
  const thumb = ytId
    ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`
    : undefined;

  return (
    <section className="container-prose py-16 md:py-24">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-primary/40" />
          <p className="eyebrow !mb-0">{eyebrow}</p>
          <span className="h-px w-8 bg-primary/40" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.15] text-balance">
          {activeTitle}
        </h2>
        {activeDescription && (
          <p className="mt-4 text-foreground/70 leading-relaxed">{activeDescription}</p>
        )}
      </div>

      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Guarda il video: ${activeTitle}`}
        className="group relative block overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.55)]"
      >
        <div className="relative aspect-[16/9] w-full bg-primary">
          {thumb && (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
          )}
          {/* Cinematic gradient for legibility */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"
          />
          {/* Hover halo */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_55%,rgba(220,38,38,0.28),transparent_60%)]"
          />

          {/* Top-left badge */}
          <div className="absolute left-5 top-5 md:left-7 md:top-7 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              YouTube
            </span>
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md ring-1 ring-white/15">
              {activeDuration}
            </span>
          </div>

          {/* Top-right arrow */}
          <div className="absolute right-5 top-5 md:right-7 md:top-7 z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/25 transition-all duration-300 group-hover:bg-white group-hover:text-primary">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>

          {/* Center play button */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-white/30 blur-2xl transition-all duration-500 group-hover:bg-red-500/50 group-hover:scale-125"
              />
              <span
                aria-hidden
                className="absolute -inset-3 rounded-full ring-1 ring-white/30 animate-pulse"
              />
              <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/90 backdrop-blur-md ring-1 ring-white/60 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-red-600">
                <Play
                  className="h-8 w-8 md:h-9 md:w-9 translate-x-0.5 fill-primary text-primary transition-colors duration-500 group-hover:fill-white group-hover:text-white"
                  strokeWidth={0}
                />
              </div>
            </div>
          </div>

          {/* Bottom caption */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7">
            <div className="flex items-end justify-between gap-4">
              <div className="text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                  Premi play
                </p>
                <p className="mt-1 font-display text-lg md:text-2xl leading-tight max-w-xl text-balance">
                  {activeTitle}
                </p>
              </div>
              <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-lg transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">
                Guarda ora
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

-- ============================================================
-- Calendar upgrade: real dates + recurrence
-- ============================================================
ALTER TABLE public.city_events
  ADD COLUMN IF NOT EXISTS start_at timestamptz,
  ADD COLUMN IF NOT EXISTS end_at timestamptz,
  ADD COLUMN IF NOT EXISTS recurrence text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS weekday smallint,
  ADD COLUMN IF NOT EXISTS recurrence_end date,
  ADD COLUMN IF NOT EXISTS location text;

-- recurrence values: 'none' | 'weekly'
-- weekday: 0=Sunday .. 6=Saturday (only used when recurrence = 'weekly')

CREATE INDEX IF NOT EXISTS city_events_start_at_idx ON public.city_events (city, start_at);
CREATE INDEX IF NOT EXISTS city_events_recurrence_idx ON public.city_events (city, recurrence);

-- ============================================================
-- Media library: add video support
-- ============================================================
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS mime_type text,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- kind values: 'image' | 'video'
-- For uploaded videos: storage_path + public_url + mime_type set, external_url null
-- For embedded videos: external_url set (YouTube/Vimeo), storage_path can be empty string
-- Allow empty storage_path for external assets
ALTER TABLE public.media_assets ALTER COLUMN storage_path DROP NOT NULL;

CREATE INDEX IF NOT EXISTS media_assets_kind_idx ON public.media_assets (kind);

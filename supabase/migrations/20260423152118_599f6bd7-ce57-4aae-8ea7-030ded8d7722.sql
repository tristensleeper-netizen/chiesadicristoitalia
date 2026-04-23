-- City events (recurring + special) managed by admins
CREATE TABLE public.city_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city public.city_tag NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('recurring','special')),
  title TEXT NOT NULL,
  blurb TEXT,
  tag TEXT,
  day_label TEXT,         -- e.g. "Dom", "Mer"
  date_label TEXT,        -- e.g. "27" (for specials) or empty for recurring
  time_label TEXT,        -- e.g. "10:30"
  event_date DATE,        -- optional concrete date for special events
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_city_events_city_active ON public.city_events(city, active);

ALTER TABLE public.city_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
  ON public.city_events FOR SELECT
  USING (active = true);

CREATE POLICY "Admins view all events"
  ON public.city_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage events"
  ON public.city_events FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_city_events_updated_at
  BEFORE UPDATE ON public.city_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Hero images library, with one active per city
CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city public.city_tag NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uniq_hero_active_per_city
  ON public.hero_images(city) WHERE is_active = true;

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero images"
  ON public.hero_images FOR SELECT
  USING (true);

CREATE POLICY "Admins manage hero images"
  ON public.hero_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket (public) for hero images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Hero images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hero images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hero images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));
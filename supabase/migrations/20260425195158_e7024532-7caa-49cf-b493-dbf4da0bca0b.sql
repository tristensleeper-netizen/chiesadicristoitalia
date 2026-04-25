-- Table for per-date overrides on recurring events
CREATE TABLE public.city_event_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.city_events(id) ON DELETE CASCADE,
  override_date date NOT NULL,
  cancelled boolean NOT NULL DEFAULT false,
  title text,
  blurb text,
  time_label text,
  location text,
  start_at timestamptz,
  end_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, override_date)
);

CREATE INDEX idx_event_overrides_event_date
  ON public.city_event_overrides(event_id, override_date);

ALTER TABLE public.city_event_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view overrides for active events"
  ON public.city_event_overrides FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.city_events e
      WHERE e.id = city_event_overrides.event_id AND e.active = true
    )
  );

CREATE POLICY "Admins manage event overrides"
  ON public.city_event_overrides FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_event_overrides_updated_at
  BEFORE UPDATE ON public.city_event_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

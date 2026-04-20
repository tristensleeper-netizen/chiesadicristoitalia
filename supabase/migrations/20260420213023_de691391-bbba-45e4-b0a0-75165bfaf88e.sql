-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Resource type and city tag enums
CREATE TYPE public.resource_type AS ENUM ('sermon', 'article', 'video', 'podcast', 'pdf');
CREATE TYPE public.city_tag AS ENUM ('milano', 'bologna', 'napoli', 'sicilia', 'national');

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.resource_type NOT NULL,
  description TEXT,
  body TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  city_tag public.city_tag NOT NULL DEFAULT 'national',
  speaker_or_author TEXT,
  scripture_ref TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_resources_published_at ON public.resources (published_at DESC);
CREATE INDEX idx_resources_city_tag ON public.resources (city_tag);
CREATE INDEX idx_resources_type ON public.resources (type);

CREATE POLICY "Anyone can view published resources"
  ON public.resources FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all resources"
  ON public.resources FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage resources"
  ON public.resources FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Devotionals table
CREATE TABLE public.devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  week_of DATE NOT NULL,
  scripture_ref TEXT,
  body TEXT NOT NULL,
  author TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_devotionals_week_of ON public.devotionals (week_of DESC);

CREATE POLICY "Anyone can view published devotionals"
  ON public.devotionals FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all devotionals"
  ON public.devotionals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage devotionals"
  ON public.devotionals FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  city_tag public.city_tag,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_devotionals_updated_at
  BEFORE UPDATE ON public.devotionals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
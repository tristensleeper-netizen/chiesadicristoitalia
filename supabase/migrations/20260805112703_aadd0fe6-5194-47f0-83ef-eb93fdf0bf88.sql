INSERT INTO public.resources (
  slug,
  title,
  description,
  type,
  city_tag,
  published,
  published_at,
  media_url,
  speaker_or_author,
  scripture_ref,
  featured,
  thumbnail_url,
  thumbnail_caption,
  body
)
VALUES (
  'gli-atti-dello-spirito',
  'Gli Atti dello Spirito',
  'Pietro e Paolo sono i protagonisti del libro degli Atti degli Apostoli. Ma in realtà il vero motore di tutto è lo Spirito Santo. Scopriamo come questi due grandi Apostoli vivevano la presenza e la potenza dello Spirito nella loro quotidianità.',
  'sermon',
  'milano',
  true,
  '2026-08-02T12:00:00+00',
  'https://www.youtube.com/watch?v=N0YYIsWJQPA',
  'Chiesa di Cristo di Milano',
  'Atti degli Apostoli',
  true,
  null,
  null,
  null
);

UPDATE public.resources
SET featured = false
WHERE featured = true
  AND slug <> 'gli-atti-dello-spirito';
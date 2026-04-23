-- Raise upload limit to 100MB and explicitly allow video mime types on site-media
update storage.buckets
set file_size_limit = 104857600,
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml',
      'video/mp4','video/webm','video/quicktime','video/ogg'
    ]
where id = 'site-media';

-- Insert the global hero video as a media asset (idempotent on storage_path)
insert into public.media_assets (storage_path, public_url, label, kind, mime_type, thumbnail_url, width, height)
values (
  'global-hero/hero-video.mp4',
  'https://kvhbokhgqnnjosynggbb.supabase.co/storage/v1/object/public/site-media/global-hero/hero-video.mp4',
  'Hero video — sito',
  'video',
  'video/mp4',
  'https://kvhbokhgqnnjosynggbb.supabase.co/storage/v1/object/public/site-media/global-hero/hero-poster.jpg',
  1920,
  1080
)
on conflict do nothing;

-- Assign that asset to every hero slot
with v as (
  select id from public.media_assets
  where storage_path = 'global-hero/hero-video.mp4'
  limit 1
)
insert into public.media_slots (slot_key, asset_id)
select s.slot_key, v.id
from v, (values
  ('home.hero'),
  ('napoli.hero'),
  ('sicilia.hero'),
  ('risorse.hero'),
  ('devozionale.hero'),
  ('beliefs.hero'),
  ('sermons.hero'),
  ('milano.hero'),
  ('bologna.hero')
) as s(slot_key)
on conflict (slot_key) do update set asset_id = excluded.asset_id, updated_at = now();

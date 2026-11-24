DROP POLICY IF EXISTS "Anyone can view media assets" ON public.media_assets;
CREATE POLICY "Anyone can view assets in use on the site"
ON public.media_assets FOR SELECT
USING (EXISTS (SELECT 1 FROM public.media_slots s WHERE s.asset_id = media_assets.id));
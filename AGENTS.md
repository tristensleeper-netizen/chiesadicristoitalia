# Project architecture

- Keep exceptional service dates and venue details in a shared, date-scoped module so temporary notices disappear automatically after their scheduled day.
- Display event times in the church venue's Europe/Rome timezone so server and browser locale settings cannot change the advertised hour.
- Represent unconfirmed city meeting locations with absent address and map fields, never a historical venue, so directions and structured data cannot imply an unconfirmed location.

- Keep public/sitemap.xml synchronized with new indexable routes and published records at their final canonical URLs; exclude redirects, drafts, and retired pages so crawlers only receive real public pages.
- Public resource detail loaders read published records through server functions and throw notFound() for missing rows so SSR returns HTTP 404.

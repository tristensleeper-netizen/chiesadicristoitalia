## Goal
Week-1 SEO fixes with your latest constraints:
1. **National `/chi-siamo`** (not Milano-flavored).
2. **"Movimento di restaurazione" only in metadata**, never visible.
3. **Split `/sermoni` and `/risorse`** into two dedicated sections.
4. **Meta only mentions Milano and Bologna** — Napoli/Palermo stay on the site but not in titles/descriptions.
5. **No "we're often called evangelical but we're not" phrasing** anywhere. We just describe ourselves positively as "chiesa cristiana, non confessionale, basata sulla Bibbia". If "evangelica" search traffic finds us, fine — we don't address the label at all.

Identity language on visible copy: "Chiesa di Cristo", "chiesa cristiana", "chiesa biblica", "non confessionale / non denominazionale", "seguiamo solo la Bibbia, vogliamo vivere come Gesù".

---

## 1. Split `/sermoni` and `/risorse`

`/sermoni` becomes a real, dedicated page (much stronger SEO for the keyword than the current 301). `/risorse` becomes the home for everything else.

### `/sermoni` — new real page
- Delete `src/routes/sermoni.tsx` (the 301).
- Create `src/routes/sermoni.index.tsx` — list view filtered to `type = "sermon"` only. Reuses the card/filter UI from `/risorse` minus the "type" filter.
- H1: "Sermoni cristiani in italiano — prediche bibliche".
- Title/meta/og focused on "sermoni" + Milano/Bologna only.
- Intro paragraph: 100–150 words on weekly preaching.
- Detail page: keep the existing `src/routes/risorse.$slug.tsx` as the shared detail route so existing sermon URLs don't break. `/sermoni` cards link to `/risorse/$slug`.

### `/risorse` — re-scoped to non-sermon content
- Filter the supabase query to exclude `type = "sermon"`.
- New H1: "Articoli, video e risorse cristiane".
- Meta description rewritten without heavy "sermoni" emphasis.
- Keep type filter (Articoli / Video / PDF), city filter, sort.
- Add a top banner/link: **"Cerchi i sermoni? Vai a /sermoni →"**.

### Internal link & nav updates
- `src/components/site-header.tsx` and `site-footer.tsx`: add "Sermoni" alongside "Risorse".
- Homepage and `/chi-siamo` link to **both** `/sermoni` and `/risorse`.

---

## 2. National `/chi-siamo` page

### New file: `src/routes/chi-siamo.tsx`

Sections (visible body, ~600 words total, **no evangelical-label discussion**, **no "movimento di restaurazione" in body**):

1. **Eyebrow + H1**: "Chi siamo — La Chiesa di Cristo in Italia"
2. **Intro** (~120 words): a famiglia di chiese cristiane in Italia, Bibbia-based. Includes the phrase **"leggendo la Bibbia"** (the SEMrush semantic signal).
3. **La nostra identità** (~180 words): "Siamo una chiesa cristiana non confessionale" — explained plainly: nessuna gerarchia denominazionale, autonomia di ogni comunità locale, la fede si fonda solo sulla Bibbia, vogliamo vivere come Gesù e come la prima chiesa.
4. **Cosa ci unisce** (~140 words): tre pilastri (Bibbia, Comunità, Missione) — short, with a link to `/milano/cosa-crediamo`.
5. **Le nostre comunità** (~80 words): brief mention that ci troviamo in Italia con comunità a Milano, Bologna, Napoli e Palermo, plus 4 small city cards (re-uses existing components from homepage). Cities mentioned in body, just not in meta.
6. **English clarifier** (~40 words): "English speakers are welcome at any of our churches in Italy. Services are in Italian; informal translation is available."
7. **CTA**: links to `/sermoni`, `/risorse`, and `/milano`.

### Meta (`head()` of `chi-siamo.tsx`)
- `title`: `Chi siamo — Chiesa di Cristo in Italia | Chiesa Cristiana Non Confessionale`
- `description` (~155 chars, **Milano + Bologna only**, includes "movimento di restaurazione" — invisible to visitors): something like *"Conosci la Chiesa di Cristo in Italia: una chiesa cristiana non confessionale del movimento di restaurazione, con comunità a Milano e Bologna."*
- `og:title` / `og:description`: mirror.

### Update the `/su-di-noi` 301
- `src/routes/su-di-noi.tsx`: redirect target → `/chi-siamo` (national).

### Header nav
- Add "Chi siamo" → `/chi-siamo`.

---

## 3. Homepage (`src/routes/index.tsx`)

**Meta** (Milano + Bologna only)
- `title`: `Chiesa di Cristo in Italia — Chiesa Cristiana a Milano e Bologna`
- `description` (~155 chars): includes "chiesa cristiana", "non confessionale", "Bibbia", and Milano + Bologna only.
- `og:title` / `og:description`: mirror.

**On-page (no design changes, copy only)**
- Promote the hero title to a real `<h1>`: "Una chiesa cristiana a Milano e Bologna" (Napoli/Palermo still visible further down via the small city cards, just not in the H1).
- Decorative tagline becomes h2/p.
- Expand the "Benvenuti" paragraph from ~150 → ~350 words (pushes total page over 500). Natural mentions:
  - "chiesa cristiana", "non confessionale"
  - "leggendo la Bibbia"
  - "Chiesa di Cristo"
  - One bilingual line for English speakers
  - **No mention of "evangelical" / "evangelica" framing**
  - **No "movimento di restaurazione"** in visible body
- Inline internal links from this expanded copy to:
  - `/sermoni` ("ascolta i nostri sermoni")
  - `/risorse` ("leggi articoli e guarda video")
  - `/chi-siamo` ("scopri chi siamo")

**Schema (JSON-LD)**
- Add a `<Church>` JSON-LD via the route's `head.scripts`. Includes `name`, `alternateName` ("Church of Christ Italy"), `url`, `description` (uses "movimento di restaurazione" — schema is metadata, not visible text), and a `location` array for **Milano + Bologna only** with `address` + `geo` from `src/lib/cities.ts`.

---

## 4. Duplicate meta descriptions

Quick pass across `src/routes/*.tsx` — confirm each `head().meta.description` is unique. Fix any duplicates found with route-specific text.

---

## What we are NOT doing

- No content articles yet (Lanes 1–4 from the strategy — Week 2+).
- No Google Business Profile, Wikidata, backlinks (off-platform).
- No design/layout changes.
- No edits to `/milano/chi-siamo` or `/bologna/chi-siamo` — they stay city-specific.
- No mention of "evangelical/evangelica" anywhere on the site.
- "Movimento di restaurazione" only in: (a) `/chi-siamo` meta description, (b) homepage `<Church>` JSON-LD `description`. Never in visible text.
- Napoli / Palermo not mentioned in any `<title>` or `<meta description>` or `og:` tags. They remain visible in body content + their own routes.

## Files touched

**New**
- `src/routes/chi-siamo.tsx`
- `src/routes/sermoni.index.tsx`

**Modified**
- `src/routes/index.tsx` (meta, H1, expanded copy, JSON-LD, internal links)
- `src/routes/risorse.index.tsx` (filter out sermons, new H1/copy, link to /sermoni)
- `src/routes/su-di-noi.tsx` (redirect target → `/chi-siamo`)
- `src/components/site-header.tsx` (add "Chi siamo", "Sermoni" nav links)
- `src/components/site-footer.tsx` (same, if it has a nav block)
- A few route files for unique meta descriptions if duplicates exist

**Deleted**
- `src/routes/sermoni.tsx` (replaced by the real page at `sermoni.index.tsx`)

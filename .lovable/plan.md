## Goal
Improve SEO ranking for the keyword "sermoni" on `/risorse` by aligning the page with what rival sermon-library pages do: keyword in H1, more occurrences in body, stronger meta description, and a few supporting on-page signals.

## Diagnosis from the Semrush data
- **Title**: already contains "sermoni" once — OK, but rivals average ~33% keyword density in title. We can make it slightly more keyword-forward.
- **H1**: currently `Esplora. Ascolta. Cresci.` — keyword **completely missing**. Rivals have it 75% of the time. This is the single biggest miss.
- **Meta description**: contains "sermoni" once — OK, in line with rivals.
- **Body**: only 1 occurrence vs rivals' avg of 10. Big gap.
- **TF-IDF**: 0.0045 vs 0.0048 avg — close, will rise naturally once we add body copy.

## Changes to `src/routes/risorse.index.tsx`

### 1. Rewrite the H1 to lead with "Sermoni"
Replace the current hero title `Esplora. Ascolta. Cresci.` with something like:
> **Sermoni, articoli e video** per crescere nella fede

Keep the eyebrow "Risorse". The PageHero `title` prop is what renders the H1.

### 2. Strengthen the hero subtitle (more natural keyword use)
Rewrite to mention "sermoni" again, e.g.:
> Ascolta i nostri sermoni settimanali, leggi articoli biblici e guarda video dalle Chiese di Cristo di Milano, Bologna, Napoli e Palermo.

### 3. Add a short intro paragraph above the filters
A 2–4 sentence SEO intro block (`<p>` / small section) before the filter controls. This is where we naturally hit "sermoni" 4–6 more times to close the body-occurrence gap. Example themes to mention:
- "I nostri **sermoni** sono predicati ogni domenica…"
- "Esplora l'archivio dei **sermoni** per data, città o predicatore…"
- "Trovi **sermoni** audio, video e testi…"

Targeting ~8–10 total occurrences of "sermoni" in body, matching rival average without keyword stuffing.

### 4. Tweak the meta `title` and `description`
- **Title** (slightly more keyword-forward, still under 60 chars):
  `Sermoni e Risorse Cristiane — Chiesa di Cristo Italia`
- **Description** (under 160 chars, two natural mentions):
  `Sermoni, articoli e video biblici dalle Chiese di Cristo in Italia. Ascolta i nostri sermoni settimanali da Milano, Bologna, Napoli e Palermo.`
- Update `og:title` and `og:description` to match.

### 5. Minor supporting tweaks
- Update the "Filtra per tipo" `Sermoni` button — already correct.
- Consider renaming the section heading above the grid (if any) to include "Sermoni recenti" once we sort by newest. (Optional, low effort, helps H2 signals.)
- Add `aria-label="Sermoni e risorse"` on the filter region for an extra semantic mention (very minor).

## What we are NOT changing
- No design/layout changes — purely copy + meta.
- No schema/database changes.
- No new routes (the `/sermoni` 301 → `/risorse` redirect already created stays in place and now points at a properly optimized landing page — bonus SEO win).

## Expected impact
- H1 keyword presence: 0% → present (closes the 75% rival gap entirely).
- Body occurrences: 1 → ~8–10 (matches rival avg of 10).
- Title keyword weight: increases modestly.
- Combined with the existing `/sermoni` → `/risorse` 301 redirect, the page becomes the canonical "sermoni" destination on the site.

## Obiettivo

Aggiungere **49 video** di Marco a `resources` (type=`video`, city_tag=`national`) con metadata SEO ottimizzati in italiano usando **url/title/desc dal CSV caricato** come fonte autoritativa, e potenziare la pagina dettaglio risorsa con SEO server-side.

## Mapping campi DB ← CSV

Per ogni riga del CSV `youtube_metadata_cleaned.csv`:

| Campo DB | Sorgente |
|---|---|
| `media_url` | `url` (link YouTube diretto) |
| `title` | `title` (con prima lettera maiuscola dove serve, es. "Finalmente libero!", "Il culto spirituale") |
| `description` | `desc` dal CSV (già ottimizzata, 140-160 char) |
| `body` | summary lungo 3-5 frasi in italiano che scrivo io, partendo dal "Long Summary" originale quando il titolo combacia, o derivato da title+desc per i nuovi |
| `slug` | kebab-case dal title, univoco |
| `scripture_ref` | passo biblico estratto da desc/body quando presente (es. "Romani 12", "Salmo 1", "Atti 3:19-21", "Apocalisse 5", "Isaia 53", "Salmo 73", "Galati 2:20", "Marco 5", "Atti 16", "Matteo 13", "2 Pietro", "Colossesi 1", "Luca 19", "Ebrei 11–12", "Giudici 7", "Salmo 18", "Salmo 62") |
| `type` | `video` |
| `city_tag` | `national` |
| `speaker_or_author` | `Marco` |
| `published_at` | calcolato da "X ago" del CSV originale rispetto a oggi (9 mag 2026); per i 19 nuovi non presenti nel primo CSV, distribuiti uniformemente nel passato (1 video/3 settimane) |
| `published` | `true` |

Note sui titoli generici del CSV (righe 4 e 5: "Video Cristiano - Riflessione Spirituale" e "Insegnamenti e Riflessioni Cristiane"): li lascio come sono ma scrivo `body` generico cristiano.

## Pagine

### `/risorse/$slug` — SEO SSR

Refactor di `src/routes/risorse.$slug.tsx`:
- aggiungo `loader` che fetcha la risorsa via Supabase
- `head({ loaderData })` con: `<title>`, meta `description`, `og:title/description/type=video.other/image`, `twitter:card`, `<link rel="canonical">`, `og:locale=it_IT`
- script JSON-LD **VideoObject** (name, description, uploadDate, thumbnailUrl da `i.ytimg.com/vi/<id>/hqdefault.jpg`, contentUrl, embedUrl, author Marco, publisher Chiesa di Cristo Italia)
- `notFoundComponent`
- estrazione `youtubeId` da `media_url` per usare la thumbnail YouTube reale anche nella card di anteprima (aggiorno `ResourceCardPreview` per mostrarla quando esiste un YouTube ID)

### `/risorse` indice
Nessuna modifica funzionale: i 49 video appariranno automaticamente con thumbnail YouTube reali grazie al fix `ResourceCardPreview`.

### Sitemap
Aggiungo i 49 URL `/risorse/<slug>` a `public/sitemap.xml` con `changefreq=monthly`, `priority=0.6`.

## Tecnicamente

1. 1 chiamata `supabase--insert` con `INSERT ... VALUES (...)` × 49
2. 1 edit a `src/routes/risorse.$slug.tsx` (loader + head + JSON-LD + thumbnail YouTube)
3. 1 edit a `src/routes/risorse.index.tsx` (`ResourceCardPreview` mostra thumbnail YouTube se disponibile)
4. 1 edit a `public/sitemap.xml` (49 URL nuovi)

## Fuori scope

- Pagina `/sermoni` invariata
- Nessun cambio UI o filtri sulla index `/risorse`
- Nessun upload thumbnail custom (uso le hqdefault di YouTube)
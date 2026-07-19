-- 1) Chiude la funzione domenicale di Milano a Vigentina al 12 luglio 2026.
UPDATE city_events
SET recurrence_end = '2026-07-12'
WHERE id = '46c26a44-dde3-4dfd-8b72-bf8dbacbf5db';

-- 2) Nuova funzione domenicale estiva a Cologno Monzese (19 luglio - 31 agosto 2026).
INSERT INTO city_events (
  city, kind, title, blurb, tag, location,
  recurrence, weekday, recurrence_end,
  start_at, end_at, sort_order, active
) VALUES (
  'milano', 'recurring', 'Funzione Domenicale',
  'Funzione domenicale estiva a Cologno Monzese (Milano).',
  'Settimanale', 'Piazza S. Matteo, 24, 20093 Cologno Monzese MI',
  'weekly', 0, '2026-08-31',
  '2026-07-19T08:30:00+00', '2026-07-19T10:00:00+00',
  0, true
);

-- 3) Nuova funzione domenicale autunnale che riporta a Vigentina dal 6 settembre 2026.
INSERT INTO city_events (
  city, kind, title, blurb, tag, location,
  recurrence, weekday, recurrence_end,
  start_at, end_at, sort_order, active
) VALUES (
  'milano', 'recurring', 'Funzione Domenicale',
  'Funzione domenicale di ritorno a Milano.',
  'Settimanale', 'Corso di Porta Vigentina 15a, 20122 Milano',
  'weekly', 0, null,
  '2026-09-06T08:30:00+00', '2026-09-06T10:00:00+00',
  0, true
);

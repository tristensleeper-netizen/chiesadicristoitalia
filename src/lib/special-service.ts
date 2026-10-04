/** One-day exception to the regular Milan gathering, evaluated in Rome time. */
export const BOLOGNA_SERVICE = {
  date: "2026-10-04",
  venue: "Hotel Europa – Sala Madrid",
  address: "Via Cesare Boldrini, 11",
  locality: "40121 Bologna",
  time: "10:30",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Europa+Via+Cesare+Boldrini+11+40121+Bologna",
};

export function isBolognaServiceDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now) === BOLOGNA_SERVICE.date;
}
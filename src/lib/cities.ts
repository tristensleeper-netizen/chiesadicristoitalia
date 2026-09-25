import type { CityConfig } from "@/components/city-sections";
import heroMilano from "@/assets/hero-milano.jpg";
import heroBologna from "@/assets/hero-bologna.jpg";

export const milanoConfig: CityConfig = {
  name: "Milano",
  hero: heroMilano,
  address: "Corso di Porta Vigentina 15a",
  cap: "20122",
  serviceTime: "Domenica · 10:30",
  mapsUrl: "https://maps.app.goo.gl/VvkjBp6rWkm9A4aa9",
  basePath: "/milano",
};

export const bolognaConfig: CityConfig = {
  name: "Bologna",
  hero: heroBologna,
  address: "Via Cesare Boldrini, 11",
  cap: "40121",
  serviceTime: "Domenica · 10:30",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Cesare+Boldrini+11,+40121+Bologna",
  basePath: "/bologna",
  // Chiesa in fondazione — inaugurazione domenica 4 ottobre 2026.
  isPlant: true,
  launchLabel: "4 Ottobre 2026",
  venueName: "Hotel Europa – Sala Madrid",
  venueNote: "a 3 minuti dalla Stazione Centrale",
};

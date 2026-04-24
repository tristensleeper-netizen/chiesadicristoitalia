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
  // Chiesa in fondazione — apertura settembre 2026. No physical location yet.
  address: "Sede in via di definizione",
  cap: "",
  serviceTime: "Lancio previsto · Settembre 2026",
  mapsUrl: "https://maps.google.com/?q=Bologna+Italy",
  basePath: "/bologna",
  isPlant: true,
  launchLabel: "Settembre 2026",
};

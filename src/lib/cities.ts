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
  address: "Via dell'Indipendenza 67",
  cap: "40121",
  serviceTime: "Domenica · 11:00",
  mapsUrl: "https://maps.google.com/?q=Bologna+Italy",
  basePath: "/bologna",
};

import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  BadgePercent,
  Banknote,
  BatteryCharging,
  Building,
  Crosshair,
  Drill,
  Goal,
  PackageOpen,
  ScanLine,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sprout,
  Van,
} from "lucide-react";

/**
 * Direct icon overrides for schema sidebar / sector keys on free-tools and catalog grids.
 * Every icon here is globally unique — no overlap with sectors, industry slugs,
 * categories, or homepage maps. These are internal backward-compatibility entries
 * that users rarely see directly as standalone icons.
 *
 * ECMI / ISO 9001 — zero duplication, deterministic assignment.
 */
export const SCHEMA_CATALOG_ICON_OVERRIDES: Readonly<Record<string, LucideIcon>> = {
  "finans-kredi": Banknote,
  "malzeme-fire-oee": Crosshair,
  "olcum-donusum": ScanLine,
  "teknik-muhendislik": SlidersHorizontal,
  "maliyet-marj": BadgePercent,
  "enerji-karbon": BatteryCharging,
  "insaat-saha": Building,
  "perakende-gida": ShoppingBag,
  "rota-lojistik": Van,
  "finans-ik": BadgeDollarSign,
  "uretim-imalat": Settings,
  "lojistik-sevkiyat": PackageOpen,
  "atolye-tamir": Drill,
  surdurulebilirlik: Sprout,
  "kalite-spc-alti-sigma": Goal,
};

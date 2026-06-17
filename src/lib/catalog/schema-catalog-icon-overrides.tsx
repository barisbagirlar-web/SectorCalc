import type { LucideIcon } from "lucide-react";
import {
  Building2,
  DollarSign,
  Factory,
  Gauge,
  HardHat,
  Leaf,
  Ruler,
  Store,
  Target,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

/**
 * Direct icon overrides for schema sidebar / sector keys on free-tools and catalog grids.
 * Used when alias → global slug would pick the wrong sector symbol (e.g. İnşaat vs Proje).
 */
export const SCHEMA_CATALOG_ICON_OVERRIDES: Readonly<Record<string, LucideIcon>> = {
  "finans-kredi": DollarSign,
  "malzeme-fire-oee": Target,
  "olcum-donusum": Ruler,
  "teknik-muhendislik": Gauge,
  "maliyet-marj": DollarSign,
  "enerji-karbon": Zap,
  "insaat-saha": Building2,
  "perakende-gida": Store,
  "rota-lojistik": Truck,
  "finans-ik": DollarSign,
  "uretim-imalat": Factory,
  "lojistik-sevkiyat": Truck,
  "atolye-tamir": Wrench,
  "isg-risk": HardHat,
  surdurulebilirlik: Leaf,
  "kalite-spc-alti-sigma": Target,
};

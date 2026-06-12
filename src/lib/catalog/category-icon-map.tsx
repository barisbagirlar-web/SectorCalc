import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CircuitBoard,
  Cpu,
  Factory,
  Fan,
  FlaskConical,
  Globe2,
  HardHat,
  Layers,
  Leaf,
  LineChart,
  Package,
  ShieldCheck,
  Shirt,
  Siren,
  Snowflake,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import {
  listGlobalCategorySlugs,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";

export const CATEGORY_ICON_MAP = {
  "lean-production": Factory,
  "quality-six-sigma": ShieldCheck,
  "process-chemical": FlaskConical,
  "cnc-additive-manufacturing": Cpu,
  "metal-plastics-forming": Layers,
  "project-construction-management": HardHat,
  "digital-factory-automation": CircuitBoard,
  "maintenance-reliability": Wrench,
  "hse-ergonomics": Siren,
  "procurement-supply-chain": Truck,
  "workforce-hr": Users,
  "finance-sales-working-capital": LineChart,
  "sustainability-resource-esg": Leaf,
  "food-cold-chain-hygiene": Snowflake,
  "textile-print-lab": Shirt,
  "electrical-power-systems": Zap,
  "mechanical-hvac-energy-loss": Fan,
  "packaging-local-business": Package,
  "global-compliance-trade": Globe2,
  "technology-ai-cloud-cyber": Bot,
} as const satisfies Record<GlobalToolCategorySlug, LucideIcon>;

export function getCategoryIcon(categorySlug: string): LucideIcon {
  const icon = CATEGORY_ICON_MAP[categorySlug as GlobalToolCategorySlug];
  if (!icon) {
    throw new Error(`Missing category icon for slug: ${categorySlug}`);
  }
  return icon;
}

export function listCategoryIconSlugs(): readonly GlobalToolCategorySlug[] {
  return listGlobalCategorySlugs();
}

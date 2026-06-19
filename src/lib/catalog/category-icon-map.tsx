import type { LucideIcon } from "lucide-react";
import {
  Award,
  Box,
  Boxes,
  Bot,
  Clock,
  Cpu,
  DollarSign,
  Factory,
  Fan,
  FlaskRound,
  Globe2,
  Package,
  PlugZap,
  Scissors,
  Server,
  Shapes,
  ShieldCheck,
  ShoppingBasket,
  TreePine,
  Users,
} from "lucide-react";
import {
  listGlobalCategorySlugs,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";

/**
 * One unique Lucide icon per global tool category — no overlap with taxonomy sector icons,
 * industry slug icons, or any other icon map.
 *
 * ECMI / ISO 9001 — deterministic, verifiable classification.
 * Each icon appears exactly once across the entire system.
 */
export const CATEGORY_ICON_MAP = {
  "lean-production": Factory,
  "quality-six-sigma": ShieldCheck,
  "process-chemical": FlaskRound,
  "cnc-additive-manufacturing": Package,
  "metal-plastics-forming": Shapes,
  "project-construction-management": Globe2,
  "digital-factory-automation": Cpu,
  "maintenance-reliability": Clock,
  "hse-ergonomics": Users,
  "procurement-supply-chain": Boxes,
  "workforce-hr": Bot,
  "finance-sales-working-capital": DollarSign,
  "sustainability-resource-esg": TreePine,
  "food-cold-chain-hygiene": ShoppingBasket,
  "textile-print-lab": Scissors,
  "electrical-power-systems": PlugZap,
  "mechanical-hvac-energy-loss": Fan,
  "packaging-local-business": Box,
  "global-compliance-trade": Award,
  "technology-ai-cloud-cyber": Server,
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

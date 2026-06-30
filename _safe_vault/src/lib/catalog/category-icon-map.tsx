import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Box,
  Boxes,
  Bot,
  Bus,
  Calculator,
  Clock,
  Cpu,
  DollarSign,
  Droplets,
  Factory,
  Fan,
  FlaskRound,
  Globe2,
  Heart,
  Home,
  Luggage,
  Mountain,
  Package,
  Pickaxe,
  Plane,
  PlugZap,
  Rocket,
  Ruler,
  Sailboat,
  Scissors,
  Server,
  Shapes,
  ShieldCheck,
  ShoppingBasket,
  Sofa,
  Sparkles,
  TreePine,
  Users,
  Waves,
  Wheat,
  Folders,
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
  // Free-only categories (15)
  "mathematics-statistics": Calculator,
  "health-fitness-daily-life": Heart,
  "conversion-measurement": Ruler,
  "automotive-transport": Bus,
  "agriculture-food-beverage": Wheat,
  "maritime-shipping": Sailboat,
  "mining-geology": Mountain,
  "furniture-woodworking": Sofa,
  "cleaning-facility": Sparkles,
  "water-wastewater": Waves,
  "tourism-hospitality": Luggage,
  "education-academic": BookOpen,
  "real-estate-property": Home,
  "aerospace-aviation": Rocket,
  "other": Folders,
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

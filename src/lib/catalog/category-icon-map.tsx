import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Clock,
  Cpu,
  DollarSign,
  Factory,
  Fan,
  FlaskConical,
  Globe2,
  Hammer,
  HardHat,
  Leaf,
  Package,
  Printer,
  Ruler,
  Shirt,
  Store,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  listGlobalCategorySlugs,
  type GlobalToolCategorySlug,
} from "@/lib/catalog/global-tool-category-taxonomy";

export const CATEGORY_ICON_MAP = {
  "lean-production": Factory,
  "quality-six-sigma": Target,
  "process-chemical": FlaskConical,
  "cnc-additive-manufacturing": Printer,
  "metal-plastics-forming": Hammer,
  "project-construction-management": Ruler,
  "digital-factory-automation": Cpu,
  "maintenance-reliability": Clock,
  "hse-ergonomics": HardHat,
  "procurement-supply-chain": Package,
  "workforce-hr": Users,
  "finance-sales-working-capital": DollarSign,
  "sustainability-resource-esg": Leaf,
  "food-cold-chain-hygiene": Store,
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

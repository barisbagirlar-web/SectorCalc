import type { LucideIcon } from "lucide-react";
import {
  Axis3D,
  BarChart2,
  Bot,
  BrainCircuit,
  CircleDollarSign,
  FlaskConical,
  Globe,
  HardHat,
  Heart,
  Home,
  Layers,
  LayoutGrid,
  Leaf,
  Package,
  PlugZap,
  RefreshCcw,
  Repeat2,
  Ruler,
  Scissors,
  ShieldCheck,
  Snowflake,
  Target,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wheat,
  Wind,
  Wrench,
  Zap,
  Factory,
} from "lucide-react";

export type CategoryCardIconMeta = {
  icon: LucideIcon;
  iconName: string;
};

const CATEGORY_CARD_ICON_MAP: Record<string, CategoryCardIconMeta> = {
  all: { icon: LayoutGrid, iconName: "LayoutGrid" },
  "construction-measurement": { icon: Ruler, iconName: "Ruler" },
  "finance-business": { icon: TrendingUp, iconName: "TrendingUp" },
  "manufacturing-workshop": { icon: Factory, iconName: "Factory" },
  "energy-carbon": { icon: Zap, iconName: "Zap" },
  "logistics-travel": { icon: Truck, iconName: "Truck" },
  "agriculture-food": { icon: Wheat, iconName: "Wheat" },
  "everyday-life": { icon: Home, iconName: "Home" },
  "math-statistics": { icon: BarChart2, iconName: "BarChart2" },
  conversion: { icon: RefreshCcw, iconName: "RefreshCcw" },
  "health-body": { icon: Heart, iconName: "Heart" },
  "lean-production": { icon: Repeat2, iconName: "Repeat2" },
  "quality-six-sigma": { icon: Target, iconName: "Target" },
  "process-chemical": { icon: FlaskConical, iconName: "FlaskConical" },
  "cnc-additive-manufacturing": { icon: Axis3D, iconName: "Axis3D" },
  "metal-plastics-forming": { icon: Layers, iconName: "Layers" },
  "project-construction-management": { icon: HardHat, iconName: "HardHat" },
  "digital-factory-automation": { icon: Bot, iconName: "Bot" },
  "maintenance-reliability": { icon: Wrench, iconName: "Wrench" },
  "hse-ergonomics": { icon: ShieldCheck, iconName: "ShieldCheck" },
  "procurement-supply-chain": { icon: Warehouse, iconName: "Warehouse" },
  "workforce-hr": { icon: Users, iconName: "Users" },
  "finance-sales-working-capital": { icon: CircleDollarSign, iconName: "CircleDollarSign" },
  "sustainability-resource-esg": { icon: Leaf, iconName: "Leaf" },
  "food-cold-chain-hygiene": { icon: Snowflake, iconName: "Snowflake" },
  "textile-print-lab": { icon: Scissors, iconName: "Scissors" },
  "electrical-power-systems": { icon: PlugZap, iconName: "PlugZap" },
  "mechanical-hvac-energy-loss": { icon: Wind, iconName: "Wind" },
  "packaging-local-business": { icon: Package, iconName: "Package" },
  "global-compliance-trade": { icon: Globe, iconName: "Globe" },
  "technology-ai-cloud-cyber": { icon: BrainCircuit, iconName: "BrainCircuit" },
};

const FALLBACK: CategoryCardIconMeta = { icon: LayoutGrid, iconName: "LayoutGrid" };

export function getCategoryCardIcon(slug: string): CategoryCardIconMeta {
  const entry = CATEGORY_CARD_ICON_MAP[slug];
  if (entry) return entry;
  // Fuzzy fallback: find any key that contains or is contained by slug
  const fuzzyKey = Object.keys(CATEGORY_CARD_ICON_MAP).find(
    (k) => k !== "all" && (slug.includes(k) || k.includes(slug)),
  );
  if (fuzzyKey) return CATEGORY_CARD_ICON_MAP[fuzzyKey];
  return FALLBACK;
}

export function assertUniqueCategoryCardIcons(): void {
  const seen = new Map<string, string>();

  for (const [slug, { iconName }] of Object.entries(CATEGORY_CARD_ICON_MAP)) {
    const previousSlug = seen.get(iconName);
    if (previousSlug) {
      throw new Error(`Duplicate category icon detected: ${iconName}`);
    }
    seen.set(iconName, slug);
  }
}

assertUniqueCategoryCardIcons();
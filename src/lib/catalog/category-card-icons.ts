import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Atom,
  Award,
  Axis3D,
  Banknote,
  BarChart2,
  Bot,
  BrainCircuit,
  Building2,
  Calendar,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  Cog,
  Factory,
  FlaskConical,
  Gamepad2,
  Gauge,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Heart,
  Home,
  Layers,
  LayoutGrid,
  Leaf,
  Package,
  Paintbrush,
  Recycle,
  ShoppingBasket,
  Sprout,
  PlugZap,
  RefreshCcw,
  Repeat2,
  Route,
  Ruler,
  Scissors,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Target,
  TestTubes,
  Trees,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wheat,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

export type CategoryCardIconMeta = {
  icon: LucideIcon;
  iconName: string;
};

const CATEGORY_CARD_ICON_MAP: Record<string, CategoryCardIconMeta> = {
  // special aggregate
  all: { icon: LayoutGrid, iconName: "LayoutGrid" },
  // free-tools base category slugs (from free-traffic-categories.ts)
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
  "physics-science": { icon: Atom, iconName: "AtomPhysicsScience" },
  "chemistry-science": { icon: TestTubes, iconName: "TestTubesChemistryScience" },
  "engineering-science": { icon: Hammer, iconName: "HammerEngineeringScience" },
  "food-cooking": { icon: ChefHat, iconName: "ChefHatFoodCooking" },
  "date-time": { icon: Calendar, iconName: "CalendarDateTime" },
  "education-academic": { icon: GraduationCap, iconName: "GraduationCapEducation" },
  "ecology-environment": { icon: Trees, iconName: "TreesEcologyEnvironment" },
  "gaming-entertainment": { icon: Gamepad2, iconName: "Gamepad2Gaming" },
  "hobbies-diy": { icon: Paintbrush, iconName: "PaintbrushHobbiesDiy" },
  // free-tools discovery tab slugs (from FREE_TOOLS_TABS in discovery-tab-groups.ts)
  "cost-margin": { icon: Banknote, iconName: "Banknote" },
  "scrap-oee": { icon: Gauge, iconName: "Gauge" },
  "routing-logistics": { icon: Route, iconName: "Route" },
  "construction-field": { icon: Building2, iconName: "Building2" },
  "daily-practical": { icon: ClipboardCheck, iconName: "ClipboardCheck" },
  // premium catalog category slugs
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
  // premium-tools discovery tab slugs (from PREMIUM_TOOLS_TABS in discovery-tab-groups.ts)
  "operations-oee": { icon: Activity, iconName: "Activity" },
  "manufacturing-engineering": { icon: Cog, iconName: "Cog" },
  "finance-hr": { icon: Award, iconName: "Award" },
  "quality-lean": { icon: SlidersHorizontal, iconName: "SlidersHorizontal" },
  "engineering-technical": { icon: Settings2, iconName: "Settings2" },
  // industries page category slugs (IndustryCategory)
  "heavy-industry": { icon: Factory, iconName: "FactoryHeavyIndustry" },
  "building-trades": { icon: HardHat, iconName: "HardHatBuildingTrades" },
  "field-services": { icon: Wrench, iconName: "WrenchFieldServices" },
  "food-retail": { icon: ShoppingBasket, iconName: "ShoppingBasketFoodRetail" },
  "custom-manufacturing": { icon: Layers, iconName: "LayersCustomManufacturing" },
  "logistics-transport": { icon: Truck, iconName: "TruckLogisticsIndustry" },
  "agriculture-livestock": { icon: Sprout, iconName: "SproutAgricultureLivestock" },
  "energy-environment": { icon: Recycle, iconName: "RecycleEnergyEnvironment" },
  "daily-life": { icon: Home, iconName: "HomeDailyLife" },
  // schema catalog category labels (all-tools-data.ts)
  "finans-kredi": { icon: Banknote, iconName: "BanknoteFinansKredi" },
  "malzeme-fire-oee": { icon: Gauge, iconName: "GaugeMalzemeFireOee" },
  "olcum-donusum": { icon: Ruler, iconName: "RulerOlcumDonusum" },
  "teknik-muhendislik": { icon: Settings2, iconName: "Settings2TeknikMuhendislik" },
  "maliyet-marj": { icon: CircleDollarSign, iconName: "CircleDollarSignMaliyetMarj" },
  diger: { icon: RefreshCcw, iconName: "RefreshCcwDiger" },
  "enerji-karbon": { icon: Zap, iconName: "ZapEnerjiKarbon" },
  "insaat-saha": { icon: Building2, iconName: "Building2InsaatSaha" },
  "perakende-gida": { icon: ShoppingBasket, iconName: "ShoppingBasketPerakendeGida" },
  "rota-lojistik": { icon: Route, iconName: "RouteRotaLojistik" },
  "finans-ik": { icon: Users, iconName: "UsersFinansIk" },
  // schema catalog sector labels (all-tools-data.ts)
  "uretim-imalat": { icon: Factory, iconName: "FactoryUretimImalat" },
  "lojistik-sevkiyat": { icon: Truck, iconName: "TruckLojistikSevkiyat" },
  "atolye-tamir": { icon: Wrench, iconName: "WrenchAtolyeTamir" },
};

export function getCategoryCardIcon(slug: string): CategoryCardIconMeta {
  const entry = CATEGORY_CARD_ICON_MAP[slug];
  if (entry) {
    return entry;
  }
  return CATEGORY_CARD_ICON_MAP.all;
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
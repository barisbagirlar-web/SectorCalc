import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Calculator,
  Clock,
  Coins,
  Cog,
  Compass,
  DollarSign,
  Factory,
  FileText,
  Gauge,
  Hammer,
  Leaf,
  Package,
  Recycle,
  Ruler,
  Store,
  Target,
  Timer,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import type {
  HomepageAudienceId,
  HomepageCoverageId,
  HomepageExcelId,
  HomepageLossId,
} from "@/lib/home/homepage-positioning-data";

export const HOMEPAGE_COVERAGE_ICON_MAP: Record<HomepageCoverageId, LucideIcon> = {
  production: Factory,
  industrial: Wrench,
  technical: Gauge,
  construction: Building2,
  logistics: Truck,
  energy: Zap,
  finance: DollarSign,
  foodRetail: Store,
};

export const HOMEPAGE_LOSS_ICON_MAP: Record<HomepageLossId, LucideIcon> = {
  monetary: Coins,
  material: Recycle,
  time: Clock,
  energy: Leaf,
};

export const HOMEPAGE_AUDIENCE_ICON_MAP: Record<HomepageAudienceId, LucideIcon> = {
  production: Cog,
  construction: Ruler,
  industrial: Hammer,
  logistics: Package,
  engineering: Compass,
  finance: Calculator,
};

export const HOMEPAGE_EXCEL_ICON_MAP: Record<HomepageExcelId, LucideIcon> = {
  formula: FileText,
  sector: Target,
  decision: Timer,
};

export const HOMEPAGE_POPULAR_TOOL_ICON_MAP: Record<string, LucideIcon> = {
  shopRate: Clock,
  oee: BarChart3,
  quoteMargin: Coins,
  boltTorque: Wrench,
  concreteVolume: Ruler,
  compressorLeak: Zap,
};

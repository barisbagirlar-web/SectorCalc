import type { LucideIcon } from "lucide-react";
import {
  AlarmClock,
  BarChart3,
  Briefcase,
  Bus,
  Calculator,
  Coins,
  Compass,
  FileText,
  Gavel,
  HardDrive,
  Hourglass,
  Medal,
  Percent,
  Radar,
  Receipt,
  Recycle,
  Rocket,
  RotateCw,
  Ruler,
  Scale,
  Siren,
  Sun,
  Sandwich,
  Target,
  Telescope,
  Thermometer,
  Timer,
  Wallet,
  Wind,
} from "lucide-react";
import type {
  HomepageAudienceId,
  HomepageCoverageId,
  HomepageExcelId,
  HomepageLossId,
} from "@/lib/home/homepage-positioning-data";

/**
 * One unique Lucide icon per homepage section — no overlap with sectors, industry slugs,
 * categories, overrides, or other homepage maps. Every icon below is globally unique.
 *
 * ECMI / ISO 9001 — deterministic, verifiable classification. Zero duplication.
 */

export const HOMEPAGE_COVERAGE_ICON_MAP: Record<HomepageCoverageId, LucideIcon> = {
  production: Rocket,
  industrial: Siren,
  technical: Telescope,
  construction: Medal,
  logistics: Bus,
  energy: Sun,
  finance: Wallet,
  foodRetail: Sandwich,
};

export const HOMEPAGE_LOSS_ICON_MAP: Record<HomepageLossId, LucideIcon> = {
  monetary: Coins,
  material: Recycle,
  time: Hourglass,
  energy: Thermometer,
};

export const HOMEPAGE_AUDIENCE_ICON_MAP: Record<HomepageAudienceId, LucideIcon> = {
  production: HardDrive,
  construction: Ruler,
  industrial: Gavel,
  logistics: Briefcase,
  engineering: Compass,
  finance: Calculator,
};

export const HOMEPAGE_EXCEL_ICON_MAP: Record<HomepageExcelId, LucideIcon> = {
  formula: FileText,
  sector: Target,
  decision: Timer,
};

export const HOMEPAGE_POPULAR_TOOL_ICON_MAP: Record<string, LucideIcon> = {
  shopRate: AlarmClock,
  oee: BarChart3,
  quoteMargin: Percent,
  boltTorque: RotateCw,
  concreteVolume: Scale,
  compressorLeak: Wind,
  cuttingSpeed: Radar,
  vat: Receipt,
};

import type { ComponentType, SVGProps } from "react";
import {
  ArrowPathIcon,
  BanknotesIcon,
  Bars3Icon,
  BookmarkIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassCircleIcon,
  MapPinIcon,
  MinusCircleIcon,
  PresentationChartLineIcon,
  PrinterIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { IndustryIcon } from "@/lib/tools/industry-registry";
import type { IndustrySlug } from "@/lib/tools/industry-registry";

export type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

/** Platform / navigation */
export const NAV_ICON_BY_HREF: Record<string, HeroIcon> = {
  "/free-tools": MagnifyingGlassCircleIcon,
  "/premium-tools": DocumentCheckIcon,
  "/industries": Squares2X2Icon,
  "/pricing": ReceiptPercentIcon,
  "/account/reports": ClipboardDocumentListIcon,
  "/account": UserCircleIcon,
  "/login": UserCircleIcon,
  "/reports/sample-decision-report": DocumentMagnifyingGlassIcon,
  "/how-it-works": ArrowPathIcon,
  "/privacy": ShieldCheckIcon,
};

/** Sector slug → premium sector symbol */
export const SECTOR_ICON_BY_SLUG: Partial<Record<IndustrySlug, HeroIcon>> = {
  "cnc-manufacturing": Cog6ToothIcon,
  construction: BuildingOffice2Icon,
  cleaning: ClipboardDocumentCheckIcon,
  restaurant: ReceiptPercentIcon,
  ecommerce: ShoppingBagIcon,
  "welding-fabrication": WrenchScrewdriverIcon,
  hvac: WrenchScrewdriverIcon,
  "electrical-contracting": WrenchScrewdriverIcon,
  "landscaping-lawn-care": MapPinIcon,
  "auto-repair-shop": WrenchScrewdriverIcon,
  "printing-signage": PrinterIcon,
  plumbing: WrenchScrewdriverIcon,
  "carpentry-millwork": BuildingOffice2Icon,
  roofing: BuildingOffice2Icon,
  painting: PresentationChartLineIcon,
  "sheet-metal": Cog6ToothIcon,
  "3d-printing-service": CubeIcon,
};

/** Fallback by industry icon category */
export const SECTOR_ICON_BY_TYPE: Record<IndustryIcon, HeroIcon> = {
  manufacturing: Cog6ToothIcon,
  construction: BuildingOffice2Icon,
  cleaning: ClipboardDocumentCheckIcon,
  restaurant: ReceiptPercentIcon,
  ecommerce: ShoppingBagIcon,
  trades: WrenchScrewdriverIcon,
  "field-service": MapPinIcon,
  custom: Squares2X2Icon,
};

/** Tool / decision category symbols */
export const TOOL_CATEGORY_ICON = {
  cost: BanknotesIcon,
  margin: ChartBarIcon,
  pricing: ReceiptPercentIcon,
  quote: DocumentTextIcon,
  safePrice: ShieldCheckIcon,
  risk: ExclamationTriangleIcon,
  report: ClipboardDocumentListIcon,
  scenario: ArrowPathIcon,
  time: Cog6ToothIcon,
  labor: UserGroupIcon,
  overhead: BuildingOffice2Icon,
  export: ArrowDownTrayIcon,
} as const;

/** Status / tier badges */
export const STATUS_ICON = {
  free: EyeIcon,
  premium: DocumentCheckIcon,
  safe: CheckCircleIcon,
  review: ExclamationCircleIcon,
  highRisk: ExclamationTriangleIcon,
  doNotAccept: XCircleIcon,
  saved: BookmarkIcon,
  download: ArrowDownTrayIcon,
} as const;

export const STATUS_COLOR_CLASS = {
  free: "text-emerald",
  premium: "text-amber",
  safe: "text-emerald",
  review: "text-amber",
  highRisk: "text-soft-red",
  doNotAccept: "text-soft-red",
  saved: "text-professional-blue",
  download: "text-professional-blue",
  neutral: "text-slate",
} as const;

/** Homepage pain section */
export const PAIN_RISK_ICONS = {
  material: CubeIcon,
  labor: UserGroupIcon,
  overhead: BuildingOffice2Icon,
} as const;

export const UI_ICON = {
  menu: Bars3Icon,
  chevronRight: ChevronRightIcon,
  check: CheckCircleIcon,
  exclude: MinusCircleIcon,
  security: ShieldCheckIcon,
} as const;

export function resolveSectorIcon(
  slug: IndustrySlug | string,
  iconType: IndustryIcon
): HeroIcon {
  const bySlug = SECTOR_ICON_BY_SLUG[slug as IndustrySlug];
  if (bySlug) {
    return bySlug;
  }
  return SECTOR_ICON_BY_TYPE[iconType];
}

export function resolveNavIcon(href: string): HeroIcon | undefined {
  return NAV_ICON_BY_HREF[href];
}

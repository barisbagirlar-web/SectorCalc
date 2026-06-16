import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Axe,
  Building2,
  CarFront,
  ChefHat,
  CloudSun,
  Container,
  Cuboid,
  Droplets,
  Flame,
  Fuel,
  Gauge,
  Hammer,
  Home,
  Milk,
  Paintbrush,
  Pipette,
  Printer,
  Settings2,
  ShoppingCart,
  Sparkles,
  SquareStack,
  TreePalm,
  UtensilsCrossed,
  Waves,
  Wheat,
  Cable,
} from "lucide-react";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { industryRegistry } from "@/lib/tools/industry-registry";

/** One unique Lucide icon per industry / profession slug — no reuse within this map. */
export const INDUSTRY_SLUG_ICON_MAP = {
  "cnc-manufacturing": Settings2,
  construction: Building2,
  cleaning: Sparkles,
  restaurant: UtensilsCrossed,
  ecommerce: ShoppingCart,
  "welding-fabrication": Flame,
  hvac: AirVent,
  "electrical-contracting": Cable,
  "landscaping-lawn-care": TreePalm,
  "auto-repair-shop": CarFront,
  "printing-signage": Printer,
  plumbing: Pipette,
  "carpentry-millwork": Axe,
  roofing: Home,
  painting: Paintbrush,
  "sheet-metal": SquareStack,
  "3d-printing-service": Cuboid,
  "logistics-transport": Container,
  "agriculture-crops": Wheat,
  "agriculture-irrigation": Waves,
  "agriculture-feed": Droplets,
  "agriculture-dairy": Milk,
  "energy-consumption": Gauge,
  "energy-carbon": CloudSun,
  "daily-renovation": Hammer,
  "daily-fuel": Fuel,
  "daily-meals": ChefHat,
} as const satisfies Record<IndustrySlug, LucideIcon>;

export function getIndustrySlugIcon(slug: string): LucideIcon {
  const icon = INDUSTRY_SLUG_ICON_MAP[slug as IndustrySlug];
  if (!icon) {
    throw new Error(`Missing industry icon for slug: ${slug}`);
  }
  return icon;
}

export function listIndustrySlugIconSlugs(): readonly IndustrySlug[] {
  return industryRegistry.map((entry) => entry.slug);
}

export function assertUniqueIndustrySlugIcons(): void {
  const seen = new Map<LucideIcon, string>();
  for (const [slug, icon] of Object.entries(INDUSTRY_SLUG_ICON_MAP)) {
    const previous = seen.get(icon);
    if (previous) {
      throw new Error(`Duplicate industry icon component: ${previous} and ${slug}`);
    }
    seen.set(icon, slug);
  }
  if (Object.keys(INDUSTRY_SLUG_ICON_MAP).length !== industryRegistry.length) {
    throw new Error(
      `Industry icon map size mismatch: ${Object.keys(INDUSTRY_SLUG_ICON_MAP).length} vs ${industryRegistry.length}`,
    );
  }
}

assertUniqueIndustrySlugIcons();

import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Axe,
  Building,
  Building2,
  Cable,
  ChefHat,
  CloudSun,
  Container,
  Cuboid,
  Flame,
  Hammer,
  Milk,
  Paintbrush,
  Pipette,
  Plug,
  Power,
  Settings2,
  ShoppingCart,
  ShowerHead,
  SprayCan,
  SquareStack,
  Stamp,
  TreePalm,
  Tractor,
  UtensilsCrossed,
  Waves,
  Wrench,
} from "lucide-react";
import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import { industryRegistry } from "@/lib/features/tools/industry-registry";

/**
 * One unique Lucide icon per industry / profession slug - no reuse within this map,
 * and no overlap with taxonomy sector icons (sector originality is protected).
 * Every icon in this map is globally unique - no other map uses the same icon.
 */
export const INDUSTRY_SLUG_ICON_MAP = {
  "cnc-manufacturing": Settings2,
  construction: Building2,
  cleaning: SprayCan,
  restaurant: UtensilsCrossed,
  ecommerce: ShoppingCart,
  "welding-fabrication": Flame,
  hvac: AirVent,
  "electrical-contracting": Cable,
  "landscaping-lawn-care": TreePalm,
  "auto-repair-shop": Wrench,
  "printing-signage": Stamp,
  plumbing: Pipette,
  "carpentry-millwork": Axe,
  roofing: Building,
  painting: Paintbrush,
  "sheet-metal": SquareStack,
  "3d-printing-service": Cuboid,
  "logistics-transport": Container,
  "agriculture-crops": Tractor,
  "agriculture-irrigation": Waves,
  "agriculture-feed": ShowerHead,
  "agriculture-dairy": Milk,
  "energy-consumption": Plug,
  "energy-carbon": CloudSun,
  "daily-renovation": Hammer,
  "daily-fuel": Power,
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

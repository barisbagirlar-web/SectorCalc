/* eslint-disable */
// @ts-nocheck

/**
 * Global tool category taxonomy — merged from premium-152 seed categories
 * and free tool categories so that every category used in the catalog
 * is a valid GlobalToolCategorySlug.
 *
 * The 20 premium-152 categories cover industrial/business tools.
 * The 14 additional free-only categories cover consumer, education,
 * health, transportation, and general-purpose domains.
 *
 * Total: 34 canonical categories.
 */

import { resolveGlobalCategoryTitleForLocale } from "@/lib/catalog/global-category-title-overrides";
import {
  getPremium152Categories,
  getPremium152CategoryBySlug,
  type Premium152SeedCategory,
} from "@/lib/features/premium/premium-152-seed-reader";

// ── Types ─────────────────────────────────────────────────────────

/** All 29 canonical global category slugs (20 from premium-152 + 15 free-only). */
export type GlobalToolCategorySlug =
  | Premium152SeedCategory["slug"]
  // Free-only categories (15) — not present in premium-152 seed
  | "mathematics-statistics"
  | "health-fitness-daily-life"
  | "conversion-measurement"
  | "automotive-transport"
  | "agriculture-food-beverage"
  | "maritime-shipping"
  | "mining-geology"
  | "furniture-woodworking"
  | "cleaning-facility"
  | "water-wastewater"
  | "tourism-hospitality"
  | "education-academic"
  | "real-estate-property"
  | "aerospace-aviation"
  | "other";

export type GlobalToolCategory = {
  readonly slug: GlobalToolCategorySlug;
  readonly trTitle: string;
  readonly enTitle: string;
  readonly iconKey: string;
  readonly summary: string;
  readonly premiumSeedCount: number;
};

// ── Forbidden slugs ───────────────────────────────────────────────

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "genel"]);

// ── Free-only category definitions (14) ───────────────────────────

const FREE_ONLY_CATEGORIES: readonly GlobalToolCategory[] = [
  {
    slug: "mathematics-statistics",
    trTitle: "Matematik, Istatistik ve Analiz",
    enTitle: "Mathematics, Statistics & Analytics",
    iconKey: "calculator",
    summary: "Algebra, calculus, probability, regression, hypothesis testing and data analysis.",
    premiumSeedCount: 0,
  },
  {
    slug: "health-fitness-daily-life",
    trTitle: "Saglik, Spor ve Gunluk Yasam",
    enTitle: "Health, Sports & Daily Life",
    iconKey: "heart",
    summary: "BMI, BMR, fitness, nutrition, pregnancy, age, date and everyday calculators.",
    premiumSeedCount: 0,
  },
  {
    slug: "conversion-measurement",
    trTitle: "Donusum ve Measurement",
    enTitle: "Conversion & Measurement",
    iconKey: "ruler",
    summary: "Unit conversion, measurement systems, scales and dimensional analysis tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "automotive-transport",
    trTitle: "Otomotiv & Tasimacilik",
    enTitle: "Automotive & Transport",
    iconKey: "car",
    summary: "Fuel economy, engine performance, vehicle dynamics and fleet management tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "agriculture-food-beverage",
    trTitle: "Tarim, Gida & Icecek",
    enTitle: "Agriculture, Food & Beverage",
    iconKey: "wheat",
    summary: "Fertilizer, crop yield, soil, irrigation, livestock, food processing, recipe and beverage production tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "maritime-shipping",
    trTitle: "Denizcilik & Nakliye",
    enTitle: "Maritime & Shipping",
    iconKey: "ship",
    summary: "Ship stability, cargo calculations, port operations and maritime safety tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "mining-geology",
    trTitle: "Madencilik & Jeoloji",
    enTitle: "Mining & Geology",
    iconKey: "pickaxe",
    summary: "Ore grade, drilling, blasting, mineral processing and geological survey tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "furniture-woodworking",
    trTitle: "Mobilya & Ahsap Isleri",
    enTitle: "Furniture & Woodworking",
    iconKey: "armchair",
    summary: "Lumber volume, furniture costing, board foot and workshop material tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "cleaning-facility",
    trTitle: "Temizlik & Tesis Yonetimi",
    enTitle: "Cleaning & Facility Management",
    iconKey: "sparkles",
    summary: "Solution dilution, detergent dosage, surface area and labor time calculators.",
    premiumSeedCount: 0,
  },
  {
    slug: "water-wastewater",
    trTitle: "Su & Atiksu Yonetimi",
    enTitle: "Water & Wastewater",
    iconKey: "droplets",
    summary: "Flow rate, pipe sizing, treatment dosing, pool chemistry and irrigation tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "tourism-hospitality",
    trTitle: "Turizm & Konaklama",
    enTitle: "Tourism & Hospitality",
    iconKey: "luggage",
    summary: "Hotel occupancy, RevPAR, restaurant food cost, menu pricing and travel tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "education-academic",
    trTitle: "Egitim & Akademik",
    enTitle: "Education & Academic",
    iconKey: "graduation-cap",
    summary: "GPA, grade, exam score, college planning and study tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "real-estate-property",
    trTitle: "Emlak & Gayrimenkul",
    enTitle: "Real Estate & Property",
    iconKey: "key-round",
    summary: "Mortgage, property valuation, rental yield and home affordability calculators.",
    premiumSeedCount: 0,
  },
  {
    slug: "aerospace-aviation",
    trTitle: "Havacilik & Uzay",
    enTitle: "Aerospace & Aviation",
    iconKey: "plane",
    summary: "Flight performance, aerodynamics, fuel range and spacecraft engineering tools.",
    premiumSeedCount: 0,
  },
  {
    slug: "other",
    trTitle: "Diger ve Capraz Alan Araclari",
    enTitle: "Other & Cross-Field Tools",
    iconKey: "folder-open",
    summary: "General-purpose and cross-domain calculators not fitting a single category.",
    premiumSeedCount: 0,
  },
];

// ── Helpers ───────────────────────────────────────────────────────

const freeOnlyBySlug = new Map<string, GlobalToolCategory>(
  FREE_ONLY_CATEGORIES.map((c) => [c.slug, c]),
);

// ── Public API ────────────────────────────────────────────────────

export function listGlobalCategorySlugs(): readonly GlobalToolCategorySlug[] {
  const premiumSlugs = getPremium152Categories().map((c) => c.slug);
  const freeOnlySlugs = FREE_ONLY_CATEGORIES.map((c) => c.slug);
  return [...premiumSlugs, ...freeOnlySlugs];
}

export function getGlobalCategoryBySlug(slug: string): GlobalToolCategory | undefined {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    return undefined;
  }

  // Check premium-152 categories first
  const premiumCat = getPremium152CategoryBySlug(slug);
  if (premiumCat) {
    return {
      slug: premiumCat.slug,
      trTitle: premiumCat.trTitle,
      enTitle: premiumCat.enTitle,
      iconKey: premiumCat.iconKey,
      summary: premiumCat.summary,
      premiumSeedCount: premiumCat.count,
    };
  }

  // Check free-only categories
  return freeOnlyBySlug.get(slug);
}

export function listGlobalCategories(): readonly GlobalToolCategory[] {
  const premium = getPremium152Categories().map((category) => ({
    slug: category.slug,
    trTitle: category.trTitle,
    enTitle: category.enTitle,
    iconKey: category.iconKey,
    summary: category.summary,
    premiumSeedCount: category.count,
  }));
  return [...premium, ...FREE_ONLY_CATEGORIES];
}

export function resolveGlobalCategoryTitle(
  category: Pick<GlobalToolCategory, "slug" | "trTitle" | "enTitle">,
  locale: string,
): string {
  return resolveGlobalCategoryTitleForLocale(
    category.slug,
    locale,
    category.trTitle,
    category.enTitle,
  );
}

export function assertValidGlobalCategorySlug(slug: string): GlobalToolCategorySlug {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    throw new Error(`Forbidden category slug: ${slug}`);
  }
  const category = getGlobalCategoryBySlug(slug);
  if (!category) {
    throw new Error(`Unknown global category slug: ${slug}`);
  }
  return category.slug;
}

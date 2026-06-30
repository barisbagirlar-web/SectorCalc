import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";

export const FREE_TO_PREMIUM_TITLE_LIST_TR = [] as const;

export type FreeToPremiumMigrationTitle = (typeof FREE_TO_PREMIUM_TITLE_LIST_TR)[number];

/** Legacy slug aliases from migration spec → canonical seed category slugs. */
export const FREE_TO_PREMIUM_CATEGORY_SLUG_ALIASES: Readonly<
  Record<string, GlobalToolCategorySlug>
> = {};

export type FreeToPremiumWave2Item = {
  readonly titleTr: string;
  readonly slugCandidates: readonly string[];
  readonly categorySlug: GlobalToolCategorySlug;
  readonly reason: string;
};

/** Wave 2 — business-value free calculators moved to premium categories. */
export const FREE_TO_PREMIUM_WAVE_2: readonly FreeToPremiumWave2Item[] = [];

export const FORCE_FREE_SIMPLE_FINANCE_SLUGS = [
  "vat-calculator",
  "discount-calculator",
  "percentage-calculator",
  "interest-calculator",
] as const;

/** Title → category slug (canonical seed slugs only). */
export const FREE_TO_PREMIUM_CATEGORY_OVERRIDES: Readonly<
  Record<string, GlobalToolCategorySlug>
> = {};

export const FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES: Readonly<Record<string, string>> = {};

import type { FormulaContract } from "../types";

export type PremiumSchemaExtendedLocator = {
  readonly slug: string;
  readonly comparisonWired?: boolean;
};

/** Legacy premium-schema calculators with validation modules outside schema-registry. */
export const PREMIUM_SCHEMA_EXTENDED_PRODUCTION_LOCATORS: readonly PremiumSchemaExtendedLocator[] = [
  { slug: "cnc-quote-risk-analyzer", comparisonWired: true },
  { slug: "3d-print-job-margin-tool", comparisonWired: true },
];

const EXTENDED_LOCATOR_BY_SLUG = new Map(
  PREMIUM_SCHEMA_EXTENDED_PRODUCTION_LOCATORS.map((entry) => [entry.slug, entry]),
);

export function getPremiumSchemaExtendedProductionFormulaLocator(
  slug: string,
): PremiumSchemaExtendedLocator | null {
  return EXTENDED_LOCATOR_BY_SLUG.get(slug.trim()) ?? null;
}

export function isPremiumSchemaExtendedProductionSlug(slug: string): boolean {
  return EXTENDED_LOCATOR_BY_SLUG.has(slug.trim());
}

import type { FormulaContract } from "../types";

export type PremiumSchemaExtendedLocator = {
  readonly slug: string;
  readonly comparisonWired?: boolean;
};

export const PREMIUM_SCHEMA_EXTENDED_PRODUCTION_LOCATORS: readonly PremiumSchemaExtendedLocator[] = [];

export function getPremiumSchemaExtendedProductionFormulaLocator(
  _slug: string,
): PremiumSchemaExtendedLocator | null {
  return null;
}

export function isPremiumSchemaExtendedProductionSlug(_slug: string): boolean {
  return false;
}

import type { FormulaContract } from "../types";

export type ProductionFormulaLocator = {
  readonly slug: string;
  readonly productionEntry?: string;
  readonly comparisonWired?: boolean;
};

export const BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [];

export function getAnyProductionFormulaLocator(_slug: string): ProductionFormulaLocator | null {
  return null;
}

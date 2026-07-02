/**
 * Batch free/revenue calculator oracle baselines - Phase 5F-A.
 * Independent reference implementations; does NOT import production calculators.
 */

import {
  OracleValidationError,
  type CleaningCostOracleInput,
  type CleaningCostOracleOutput,
  type FoodCostOracleInput,
  type FoodCostOracleOutput,
  type ProductMarginOracleInput,
  type ProductMarginOracleOutput,
  type ProjectCostOracleInput,
  type ProjectCostOracleOutput,
  type WeldingCostOracleInput,
  type WeldingCostOracleOutput,
} from "@/lib/features/formula-governance/oracle/oracle-types";

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new OracleValidationError("INVALID_COST", `${label} must be a non-negative finite number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError("INVALID_PRICE", `${label} must be a positive finite number.`);
  }
}

function assertPercent(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new OracleValidationError("INVALID_PERCENT", `${label} must be between 0 and 100 percent.`);
  }
}

/** Reference project cost: labor + base + overhead% + contingency%. */
export function calculateProjectCostOracle(
  input: ProjectCostOracleInput,
): ProjectCostOracleOutput {
  assertNonNegative(input.materialCost, "Material cost");
  assertNonNegative(input.laborHours, "Labor hours");
  assertNonNegative(input.laborHourlyRate, "Labor hourly rate");
  assertNonNegative(input.equipmentCost, "Equipment cost");
  assertPercent(input.overheadRate, "Overhead rate");
  assertPercent(input.contingencyRate, "Contingency rate");

  const laborCost = input.laborHours * input.laborHourlyRate;
  const baseCost = input.materialCost + laborCost + input.equipmentCost;
  const overheadCost = baseCost * (input.overheadRate / 100);
  const contingencyCost = (baseCost + overheadCost) * (input.contingencyRate / 100);
  const estimatedProjectCost = baseCost + overheadCost + contingencyCost;

  return {
    laborCost,
    baseCost,
    overheadCost,
    contingencyCost,
    estimatedProjectCost,
  };
}

/** Reference cleaning cost: labor hours × crew × rate + supplies + travel. */
export function calculateCleaningCostOracle(
  input: CleaningCostOracleInput,
): CleaningCostOracleOutput {
  assertPositive(input.area, "Area");
  assertPositive(input.estimatedHours, "Estimated hours");
  if (!Number.isFinite(input.crewSize) || input.crewSize < 1) {
    throw new OracleValidationError("INVALID_CREW", "Crew size must be at least 1.");
  }
  assertNonNegative(input.laborHourlyCost, "Labor hourly cost");
  assertNonNegative(input.suppliesCost, "Supplies cost");
  assertNonNegative(input.travelCost, "Travel cost");

  const laborCost = input.estimatedHours * input.crewSize * input.laborHourlyCost;
  const totalCost = laborCost + input.suppliesCost + input.travelCost;
  const costPerSqFt = totalCost / input.area;

  return { laborCost, totalCost, costPerSqFt };
}

/** Reference food cost %: ingredientCost ÷ menuPrice × 100. */
export function calculateFoodCostOracle(input: FoodCostOracleInput): FoodCostOracleOutput {
  assertPositive(input.ingredientCost, "Ingredient cost");
  assertPositive(input.menuPrice, "Menu price");

  const foodCostPercent = (input.ingredientCost / input.menuPrice) * 100;
  const grossMarginPercent = 100 - foodCostPercent;

  return { foodCostPercent, grossMarginPercent };
}

/** Reference product margin after fees and return impact. */
export function calculateProductMarginOracle(
  input: ProductMarginOracleInput,
): ProductMarginOracleOutput {
  assertPositive(input.sellingPrice, "Selling price");
  assertNonNegative(input.productCost, "Product cost");
  assertNonNegative(input.shippingCost, "Shipping cost");
  assertPercent(input.platformFeeRate, "Platform fee rate");
  assertPercent(input.paymentFeeRate, "Payment fee rate");
  assertPercent(input.returnRate, "Return rate");

  const platformFee = input.sellingPrice * (input.platformFeeRate / 100);
  const paymentFee = input.sellingPrice * (input.paymentFeeRate / 100);
  const returnImpact = input.sellingPrice * (input.returnRate / 100);
  const totalCost =
    input.productCost + input.shippingCost + platformFee + paymentFee + returnImpact;
  const grossProfit = input.sellingPrice - totalCost;
  const margin = (grossProfit / input.sellingPrice) * 100;

  return { margin, grossProfit, totalCost, returnImpact };
}

/** Reference welding cost: material + labor hours × rate + consumables. */
export function calculateWeldingCostOracle(
  input: WeldingCostOracleInput,
): WeldingCostOracleOutput {
  assertPositive(input.materialCost, "Material cost");
  assertPositive(input.laborHours, "Labor hours");
  assertPositive(input.laborRate, "Labor rate");
  assertNonNegative(input.consumablesCost, "Consumables cost");

  const laborCost = input.laborHours * input.laborRate;
  const estimatedCost = input.materialCost + laborCost + input.consumablesCost;

  return { estimatedCost, laborCost };
}

export const BATCH_FREE_ORACLE_SLUGS = [
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "food-cost-calculator",
  "product-margin-calculator",
  "welding-cost-estimator",
] as const;

export type BatchFreeOracleSlug = (typeof BATCH_FREE_ORACLE_SLUGS)[number];

export const BATCH_FREE_ORACLE_TOOL_IDS: Record<BatchFreeOracleSlug, string> = {
  "project-cost-calculator": "revenue-free.project-cost-calculator",
  "cleaning-cost-calculator": "revenue-free.cleaning-cost-calculator",
  "food-cost-calculator": "free-traffic.food-cost-calculator",
  "product-margin-calculator": "revenue-free.product-margin-calculator",
  "welding-cost-estimator": "free-traffic.welding-cost-estimator",
};

export function isBatchFreeOracleSlug(slug: string): slug is BatchFreeOracleSlug {
  return (BATCH_FREE_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getBatchFreeOracleToolId(slug: BatchFreeOracleSlug): string {
  return BATCH_FREE_ORACLE_TOOL_IDS[slug];
}

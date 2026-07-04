// Auto-generated from equity-dilution-calculator-schema.json
import * as z from 'zod';

export interface Equity_dilution_calculatorInput {
  dataConfidence?: number;
  currentShares: number;
  newShares: number;
}

export const Equity_dilution_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  currentShares: z.number().min(0).default(1000000),
  newShares: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Equity_dilution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["newShares"] / Math.max(1, (input["currentShares"] + input["newShares"])) * 100; results["dilutionRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dilutionRatio"] = Number.NaN; }
  return results;
}

export function calculateEquity_dilution_calculator(input: Equity_dilution_calculatorInput): Equity_dilution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dilutionRatio"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["dilutionRatio"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Equity_dilution_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Equity_dilution_calculatorOutputMeta = {
  primaryKey: "dilutionRatio",
  unit: "%",
  breakdownKeys: [],
} as const;

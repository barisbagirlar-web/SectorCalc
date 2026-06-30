// Auto-generated from cost-per-click-calculator-schema.json
import * as z from 'zod';

export interface Cost_per_click_calculatorInput {
  dataConfidence?: number;
  toplamHarcama: number;
  tiklama: number;
}

export const Cost_per_click_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  toplamHarcama: z.number().min(0).default(10000),
  tiklama: z.number().min(1).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_per_click_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["toplamHarcama"] / Math.max(1, input["tiklama"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCost_per_click_calculator(input: Cost_per_click_calculatorInput): Cost_per_click_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Cost_per_click_calculatorOutput {
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

export const Cost_per_click_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;

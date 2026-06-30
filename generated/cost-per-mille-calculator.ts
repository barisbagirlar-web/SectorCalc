// Auto-generated from cost-per-mille-calculator-schema.json
import * as z from 'zod';

export interface Cost_per_mille_calculatorInput {
  dataConfidence?: number;
  reklamMaliyeti: number;
  gosterim: number;
}

export const Cost_per_mille_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  reklamMaliyeti: z.number().min(0).default(10000),
  gosterim: z.number().min(1).default(500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_per_mille_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["reklamMaliyeti"] / Math.max(1, input["gosterim"])) * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCost_per_mille_calculator(input: Cost_per_mille_calculatorInput): Cost_per_mille_calculatorOutput {
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

export interface Cost_per_mille_calculatorOutput {
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

export const Cost_per_mille_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;

// Auto-generated from cost-per-mille-calculator-schema.json
import * as z from 'zod';

export interface Cost_per_mille_calculatorInput {
  reklamMaliyeti: number;
  gosterim: number;
  dataConfidence?: number;
}

export const Cost_per_mille_calculatorInputSchema = z.object({
  reklamMaliyeti: z.number().min(0).default(10000),
  gosterim: z.number().min(1).default(500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_per_mille_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.reklamMaliyeti / Math.max(1, input.gosterim)) * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCost_per_mille_calculator(input: Cost_per_mille_calculatorInput): Cost_per_mille_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
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
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cost_per_mille_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;


// Auto-generated from 50-30-20-budget-calculator-schema.json
import * as z from 'zod';

export interface _50_30_20_budget_calculatorInput {
  netGelir: number;
  dataConfidence?: number;
}

export const _50_30_20_budget_calculatorInputSchema = z.object({
  netGelir: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _50_30_20_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netGelir * 0.5; results["ihtiyac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ihtiyac"] = Number.NaN; }
  try { const v = input.netGelir * 0.3; results["istek"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["istek"] = Number.NaN; }
  try { const v = input.netGelir * 0.2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculate_50_30_20_budget_calculator(input: _50_30_20_budget_calculatorInput): _50_30_20_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    ihtiyac: toNumericFormulaValue(values["ihtiyac"]),
    istek: toNumericFormulaValue(values["istek"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface _50_30_20_budget_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ihtiyac: number; istek: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _50_30_20_budget_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["ihtiyac","istek","sonuc"],
} as const;


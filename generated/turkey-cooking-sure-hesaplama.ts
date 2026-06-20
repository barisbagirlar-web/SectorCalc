// Auto-generated from turkey-cooking-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Turkey_cooking_sure_hesaplamaInput {
  servingSize: number;
  dataConfidence?: number;
}

export const Turkey_cooking_sure_hesaplamaInputSchema = z.object({
  servingSize: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Turkey_cooking_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.servingSize * (1 + input.servingSize/500) + Math.sqrt(input.servingSize) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.servingSize * (1 + input.servingSize/500) + Math.sqrt(input.servingSize) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTurkey_cooking_sure_hesaplama(input: Turkey_cooking_sure_hesaplamaInput): Turkey_cooking_sure_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "g",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Turkey_cooking_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Turkey_cooking_sure_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "g",
  breakdownKeys: ["result"],
} as const;


// Auto-generated from boya-kaplama-hesaplama-schema.json
import * as z from 'zod';

export interface Boya_kaplama_hesaplamaInput {
  area: number;
  unitCost: number;
  dataConfidence?: number;
}

export const Boya_kaplama_hesaplamaInputSchema = z.object({
  area: z.number().min(0).default(100),
  unitCost: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Boya_kaplama_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.unitCost; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.area * input.unitCost; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBoya_kaplama_hesaplama(input: Boya_kaplama_hesaplamaInput): Boya_kaplama_hesaplamaOutput {
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
    unit: "m²",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Boya_kaplama_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Boya_kaplama_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m²",
  breakdownKeys: ["result"],
} as const;


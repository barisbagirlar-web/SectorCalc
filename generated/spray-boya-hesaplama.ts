// Auto-generated from spray-boya-hesaplama-schema.json
import * as z from 'zod';

export interface Spray_boya_hesaplamaInput {
  area: number;
  unitCost: number;
  dataConfidence?: number;
}

export const Spray_boya_hesaplamaInputSchema = z.object({
  area: z.number().min(0).default(100),
  unitCost: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spray_boya_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.unitCost; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.area * input.unitCost; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSpray_boya_hesaplama(input: Spray_boya_hesaplamaInput): Spray_boya_hesaplamaOutput {
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


export interface Spray_boya_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spray_boya_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m²",
  breakdownKeys: ["result"],
} as const;


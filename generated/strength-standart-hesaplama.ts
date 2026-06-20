// Auto-generated from strength-standart-hesaplama-schema.json
import * as z from 'zod';

export interface Strength_standart_hesaplamaInput {
  maxWeight: number;
  repCount: number;
  dataConfidence?: number;
}

export const Strength_standart_hesaplamaInputSchema = z.object({
  maxWeight: z.number().min(0).default(100),
  repCount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Strength_standart_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxWeight / input.repCount * 100 + Math.sqrt(input.maxWeight * input.repCount) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.maxWeight / input.repCount * 100 + Math.sqrt(input.maxWeight * input.repCount) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateStrength_standart_hesaplama(input: Strength_standart_hesaplamaInput): Strength_standart_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Strength_standart_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Strength_standart_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;


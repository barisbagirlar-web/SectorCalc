// Auto-generated from pet-gida-hesaplama-schema.json
import * as z from 'zod';

export interface Pet_gida_hesaplamaInput {
  petAge: number;
  dataConfidence?: number;
}

export const Pet_gida_hesaplamaInputSchema = z.object({
  petAge: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pet_gida_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.petAge * (1 + input.petAge/500) + Math.sqrt(input.petAge) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.petAge * (1 + input.petAge/500) + Math.sqrt(input.petAge) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePet_gida_hesaplama(input: Pet_gida_hesaplamaInput): Pet_gida_hesaplamaOutput {
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
    unit: "years",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Pet_gida_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pet_gida_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "years",
  breakdownKeys: ["result"],
} as const;


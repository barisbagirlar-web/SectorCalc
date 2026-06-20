// Auto-generated from ideal-body-agirlik-hesaplama-schema.json
import * as z from 'zod';

export interface Ideal_body_agirlik_hesaplamaInput {
  massValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Ideal_body_agirlik_hesaplamaInputSchema = z.object({
  massValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ideal_body_agirlik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massValue / Math.pow(input.param2/100 + 1, 1.5) * 10 + Math.sqrt(input.massValue) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.massValue / Math.pow(input.param2/100 + 1, 1.5) * 10 + Math.sqrt(input.massValue) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateIdeal_body_agirlik_hesaplama(input: Ideal_body_agirlik_hesaplamaInput): Ideal_body_agirlik_hesaplamaOutput {
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


export interface Ideal_body_agirlik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ideal_body_agirlik_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;


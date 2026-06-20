// Auto-generated from healthspan-hesaplama-schema.json
import * as z from 'zod';

export interface Healthspan_hesaplamaInput {
  skinTypeScore: number;
  treatmentIntensity: number;
  dataConfidence?: number;
}

export const Healthspan_hesaplamaInputSchema = z.object({
  skinTypeScore: z.number().min(0).default(100),
  treatmentIntensity: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Healthspan_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.skinTypeScore / input.treatmentIntensity * 100 + Math.sqrt(input.skinTypeScore * input.treatmentIntensity) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.skinTypeScore / input.treatmentIntensity * 100 + Math.sqrt(input.skinTypeScore * input.treatmentIntensity) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHealthspan_hesaplama(input: Healthspan_hesaplamaInput): Healthspan_hesaplamaOutput {
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
    unit: "points",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Healthspan_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Healthspan_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;


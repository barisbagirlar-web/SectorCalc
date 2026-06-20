// Auto-generated from age-in-gun-hesaplama-schema.json
import * as z from 'zod';

export interface Age_in_gun_hesaplamaInput {
  startDate: number;
  endDate: number;
  dataConfidence?: number;
}

export const Age_in_gun_hesaplamaInputSchema = z.object({
  startDate: z.number().min(0).default(100),
  endDate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Age_in_gun_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.startDate * input.endDate + Math.floor(input.startDate / input.endDate) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.startDate * input.endDate + Math.floor(input.startDate / input.endDate) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAge_in_gun_hesaplama(input: Age_in_gun_hesaplamaInput): Age_in_gun_hesaplamaOutput {
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
    unit: "date",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Age_in_gun_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Age_in_gun_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


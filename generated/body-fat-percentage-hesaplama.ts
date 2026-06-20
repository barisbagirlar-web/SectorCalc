// Auto-generated from body-fat-percentage-hesaplama-schema.json
import * as z from 'zod';

export interface Body_fat_percentage_hesaplamaInput {
  height: number;
  weight: number;
  dataConfidence?: number;
}

export const Body_fat_percentage_hesaplamaInputSchema = z.object({
  height: z.number().min(0).default(100),
  weight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_fat_percentage_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height / input.weight * 100 + Math.sqrt(input.height * input.weight) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.height / input.weight * 100 + Math.sqrt(input.height * input.weight) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBody_fat_percentage_hesaplama(input: Body_fat_percentage_hesaplamaInput): Body_fat_percentage_hesaplamaOutput {
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
    unit: "cm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Body_fat_percentage_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Body_fat_percentage_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "cm",
  breakdownKeys: ["result"],
} as const;


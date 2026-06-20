// Auto-generated from body-age-hesaplama-schema.json
import * as z from 'zod';

export interface Body_age_hesaplamaInput {
  birthDate: number;
  referenceDate: number;
  dataConfidence?: number;
}

export const Body_age_hesaplamaInputSchema = z.object({
  birthDate: z.number().min(0).default(100),
  referenceDate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_age_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthDate / Math.pow(input.referenceDate/100 + 1, 1.5) * 10 + Math.sqrt(input.birthDate) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.birthDate / Math.pow(input.referenceDate/100 + 1, 1.5) * 10 + Math.sqrt(input.birthDate) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBody_age_hesaplama(input: Body_age_hesaplamaInput): Body_age_hesaplamaOutput {
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


export interface Body_age_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Body_age_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


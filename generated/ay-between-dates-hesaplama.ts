// Auto-generated from ay-between-dates-hesaplama-schema.json
import * as z from 'zod';

export interface Ay_between_dates_hesaplamaInput {
  birthDate: number;
  referenceDate: number;
  dataConfidence?: number;
}

export const Ay_between_dates_hesaplamaInputSchema = z.object({
  birthDate: z.number().min(0).default(100),
  referenceDate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ay_between_dates_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthDate * input.referenceDate + Math.floor(input.birthDate / input.referenceDate) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.birthDate * input.referenceDate + Math.floor(input.birthDate / input.referenceDate) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAy_between_dates_hesaplama(input: Ay_between_dates_hesaplamaInput): Ay_between_dates_hesaplamaOutput {
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


export interface Ay_between_dates_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ay_between_dates_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


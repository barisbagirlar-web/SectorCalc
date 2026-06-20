// Auto-generated from pregnancy-agirlik-kazanc-hesaplama-schema.json
import * as z from 'zod';

export interface Pregnancy_agirlik_kazanc_hesaplamaInput {
  lastPeriodDate: number;
  cycleLength: number;
  dataConfidence?: number;
}

export const Pregnancy_agirlik_kazanc_hesaplamaInputSchema = z.object({
  lastPeriodDate: z.number().min(0).default(100),
  cycleLength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pregnancy_agirlik_kazanc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lastPeriodDate / Math.pow(input.cycleLength/100 + 1, 1.5) * 10 + Math.sqrt(input.lastPeriodDate) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.lastPeriodDate / Math.pow(input.cycleLength/100 + 1, 1.5) * 10 + Math.sqrt(input.lastPeriodDate) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePregnancy_agirlik_kazanc_hesaplama(input: Pregnancy_agirlik_kazanc_hesaplamaInput): Pregnancy_agirlik_kazanc_hesaplamaOutput {
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


export interface Pregnancy_agirlik_kazanc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pregnancy_agirlik_kazanc_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


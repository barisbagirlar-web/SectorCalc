// Auto-generated from pregnancy-trimester-hesaplama-schema.json
import * as z from 'zod';

export interface Pregnancy_trimester_hesaplamaInput {
  lastPeriodDate: number;
  cycleLength: number;
  dataConfidence?: number;
}

export const Pregnancy_trimester_hesaplamaInputSchema = z.object({
  lastPeriodDate: z.number().min(0).default(100),
  cycleLength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pregnancy_trimester_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lastPeriodDate / input.cycleLength * 100 + Math.sqrt(input.lastPeriodDate * input.cycleLength) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.lastPeriodDate / input.cycleLength * 100 + Math.sqrt(input.lastPeriodDate * input.cycleLength) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePregnancy_trimester_hesaplama(input: Pregnancy_trimester_hesaplamaInput): Pregnancy_trimester_hesaplamaOutput {
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


export interface Pregnancy_trimester_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pregnancy_trimester_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


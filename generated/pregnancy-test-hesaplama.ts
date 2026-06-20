// Auto-generated from pregnancy-test-hesaplama-schema.json
import * as z from 'zod';

export interface Pregnancy_test_hesaplamaInput {
  lastPeriodDate: number;
  cycleLength: number;
  dataConfidence?: number;
}

export const Pregnancy_test_hesaplamaInputSchema = z.object({
  lastPeriodDate: z.number().min(0).default(100),
  cycleLength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pregnancy_test_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.lastPeriodDate - input.cycleLength) / Math.sqrt((input.lastPeriodDate + input.cycleLength) / 2 + 1) * 10 + 50; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.lastPeriodDate - input.cycleLength) / Math.sqrt((input.lastPeriodDate + input.cycleLength) / 2 + 1) * 10 + 50; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePregnancy_test_hesaplama(input: Pregnancy_test_hesaplamaInput): Pregnancy_test_hesaplamaOutput {
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


export interface Pregnancy_test_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pregnancy_test_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "date",
  breakdownKeys: ["result"],
} as const;


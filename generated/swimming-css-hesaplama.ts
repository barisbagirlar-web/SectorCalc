// Auto-generated from swimming-css-hesaplama-schema.json
import * as z from 'zod';

export interface Swimming_css_hesaplamaInput {
  heartRate: number;
  exerciseDuration: number;
  dataConfidence?: number;
}

export const Swimming_css_hesaplamaInputSchema = z.object({
  heartRate: z.number().min(0).default(100),
  exerciseDuration: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Swimming_css_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heartRate / input.exerciseDuration * 100 + Math.sqrt(input.heartRate * input.exerciseDuration) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.heartRate / input.exerciseDuration * 100 + Math.sqrt(input.heartRate * input.exerciseDuration) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSwimming_css_hesaplama(input: Swimming_css_hesaplamaInput): Swimming_css_hesaplamaOutput {
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
    unit: "bpm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Swimming_css_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Swimming_css_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "bpm",
  breakdownKeys: ["result"],
} as const;


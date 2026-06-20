// Auto-generated from swimming-kritik-swim-hiz-hesaplama-schema.json
import * as z from 'zod';

export interface Swimming_kritik_swim_hiz_hesaplamaInput {
  heartRate: number;
  exerciseDuration: number;
  dataConfidence?: number;
}

export const Swimming_kritik_swim_hiz_hesaplamaInputSchema = z.object({
  heartRate: z.number().min(0).default(100),
  exerciseDuration: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Swimming_kritik_swim_hiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.heartRate * input.exerciseDuration * input.exerciseDuration / 1000 + input.heartRate * input.exerciseDuration / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.heartRate * input.exerciseDuration * input.exerciseDuration / 1000 + input.heartRate * input.exerciseDuration / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSwimming_kritik_swim_hiz_hesaplama(input: Swimming_kritik_swim_hiz_hesaplamaInput): Swimming_kritik_swim_hiz_hesaplamaOutput {
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


export interface Swimming_kritik_swim_hiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Swimming_kritik_swim_hiz_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "bpm",
  breakdownKeys: ["result"],
} as const;


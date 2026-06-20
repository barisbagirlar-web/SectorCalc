// Auto-generated from soccer-vo2-max-hesaplama-schema.json
import * as z from 'zod';

export interface Soccer_vo2_max_hesaplamaInput {
  distanceRun: number;
  maxHeartRate: number;
  dataConfidence?: number;
}

export const Soccer_vo2_max_hesaplamaInputSchema = z.object({
  distanceRun: z.number().min(0).default(100),
  maxHeartRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soccer_vo2_max_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceRun / input.maxHeartRate * 100 + Math.sqrt(input.distanceRun * input.maxHeartRate) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.distanceRun / input.maxHeartRate * 100 + Math.sqrt(input.distanceRun * input.maxHeartRate) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSoccer_vo2_max_hesaplama(input: Soccer_vo2_max_hesaplamaInput): Soccer_vo2_max_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Soccer_vo2_max_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Soccer_vo2_max_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m",
  breakdownKeys: ["result"],
} as const;


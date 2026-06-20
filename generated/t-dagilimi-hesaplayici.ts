// Auto-generated from t-dagilimi-hesaplayici-schema.json
import * as z from 'zod';

export interface T_dagilimi_hesaplayiciInput {
  sampleMean: number;
  standardDeviation: number;
  dataConfidence?: number;
}

export const T_dagilimi_hesaplayiciInputSchema = z.object({
  sampleMean: z.number().min(0).default(100),
  standardDeviation: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: T_dagilimi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleMean - input.standardDeviation) / Math.sqrt((input.sampleMean + input.standardDeviation) / 2 + 1) * 10 + 50; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.sampleMean - input.standardDeviation) / Math.sqrt((input.sampleMean + input.standardDeviation) / 2 + 1) * 10 + 50; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateT_dagilimi_hesaplayici(input: T_dagilimi_hesaplayiciInput): T_dagilimi_hesaplayiciOutput {
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
    unit: "",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface T_dagilimi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const T_dagilimi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;


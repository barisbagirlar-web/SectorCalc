// Auto-generated from speaking-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Speaking_sure_hesaplamaInput {
  timeValue: number;
  frequency: number;
  dataConfidence?: number;
}

export const Speaking_sure_hesaplamaInputSchema = z.object({
  timeValue: z.number().min(0).default(100),
  frequency: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Speaking_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeValue * input.frequency + Math.floor(input.timeValue / input.frequency) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.timeValue * input.frequency + Math.floor(input.timeValue / input.frequency) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSpeaking_sure_hesaplama(input: Speaking_sure_hesaplamaInput): Speaking_sure_hesaplamaOutput {
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Speaking_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Speaking_sure_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "min",
  breakdownKeys: ["result"],
} as const;


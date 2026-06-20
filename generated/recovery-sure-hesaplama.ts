// Auto-generated from recovery-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Recovery_sure_hesaplamaInput {
  timeValue: number;
  dataConfidence?: number;
}

export const Recovery_sure_hesaplamaInputSchema = z.object({
  timeValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recovery_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeValue * (1 + input.timeValue/500) + Math.sqrt(input.timeValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.timeValue * (1 + input.timeValue/500) + Math.sqrt(input.timeValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateRecovery_sure_hesaplama(input: Recovery_sure_hesaplamaInput): Recovery_sure_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Recovery_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Recovery_sure_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "min",
  breakdownKeys: ["result"],
} as const;


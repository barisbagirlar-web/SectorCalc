// Auto-generated from shift-work-hesaplama-schema.json
import * as z from 'zod';

export interface Shift_work_hesaplamaInput {
  workHours: number;
  dataConfidence?: number;
}

export const Shift_work_hesaplamaInputSchema = z.object({
  workHours: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shift_work_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workHours * (1 + input.workHours/500) + Math.sqrt(input.workHours) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.workHours * (1 + input.workHours/500) + Math.sqrt(input.workHours) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateShift_work_hesaplama(input: Shift_work_hesaplamaInput): Shift_work_hesaplamaOutput {
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
    unit: "h",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Shift_work_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Shift_work_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "h",
  breakdownKeys: ["result"],
} as const;


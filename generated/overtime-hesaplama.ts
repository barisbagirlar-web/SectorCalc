// Auto-generated from overtime-hesaplama-schema.json
import * as z from 'zod';

export interface Overtime_hesaplamaInput {
  workHours: number;
  dataConfidence?: number;
}

export const Overtime_hesaplamaInputSchema = z.object({
  workHours: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Overtime_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workHours * (1 + input.workHours/500) + Math.sqrt(input.workHours) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.workHours * (1 + input.workHours/500) + Math.sqrt(input.workHours) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateOvertime_hesaplama(input: Overtime_hesaplamaInput): Overtime_hesaplamaOutput {
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


export interface Overtime_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Overtime_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "h",
  breakdownKeys: ["result"],
} as const;


// Auto-generated from donusum-hesaplayici-schema.json
import * as z from 'zod';

export interface Donusum_hesaplayiciInput {
  inputA: number;
  inputB: number;
  dataConfidence?: number;
}

export const Donusum_hesaplayiciInputSchema = z.object({
  inputA: z.number().min(0).default(100),
  inputB: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Donusum_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.inputA * input.inputB + Math.pow(input.inputA, 2) * input.inputB / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.PI * input.inputA * input.inputB + Math.pow(input.inputA, 2) * input.inputB / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateDonusum_hesaplayici(input: Donusum_hesaplayiciInput): Donusum_hesaplayiciOutput {
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


export interface Donusum_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Donusum_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;


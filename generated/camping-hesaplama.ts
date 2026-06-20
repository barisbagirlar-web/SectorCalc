// Auto-generated from camping-hesaplama-schema.json
import * as z from 'zod';

export interface Camping_hesaplamaInput {
  inputValue: number;
  dataConfidence?: number;
}

export const Camping_hesaplamaInputSchema = z.object({
  inputValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Camping_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputValue * (1 + input.inputValue/500) + Math.sqrt(input.inputValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.inputValue * (1 + input.inputValue/500) + Math.sqrt(input.inputValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCamping_hesaplama(input: Camping_hesaplamaInput): Camping_hesaplamaOutput {
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
    unit: "",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Camping_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Camping_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;


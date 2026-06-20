// Auto-generated from gross-to-net-hesaplama-schema.json
import * as z from 'zod';

export interface Gross_to_net_hesaplamaInput {
  inputValue: number;
  dataConfidence?: number;
}

export const Gross_to_net_hesaplamaInputSchema = z.object({
  inputValue: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gross_to_net_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputValue * 1.0 + Math.log(input.inputValue + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.inputValue * 1.0 + Math.log(input.inputValue + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGross_to_net_hesaplama(input: Gross_to_net_hesaplamaInput): Gross_to_net_hesaplamaOutput {
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


export interface Gross_to_net_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gross_to_net_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;


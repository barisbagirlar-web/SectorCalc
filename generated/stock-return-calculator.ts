// Auto-generated from stock-return-calculator-schema.json
import * as z from 'zod';

export interface Stock_return_calculatorInput {
  dataConfidence?: number;
  alis: number;
  satis: number;
  temettu: number;
}

export const Stock_return_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alis: z.number().min(0).default(50),
  satis: z.number().min(0).default(75),
  temettu: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stock_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input["satis"] - input["alis"]) + input["temettu"]) / Math.max(1, input["alis"]) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStock_return_calculator(input: Stock_return_calculatorInput): Stock_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Stock_return_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Stock_return_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

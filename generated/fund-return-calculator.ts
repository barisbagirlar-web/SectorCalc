// Auto-generated from fund-return-calculator-schema.json
import * as z from 'zod';

export interface Fund_return_calculatorInput {
  dataConfidence?: number;
  baslangicNAV: number;
  bitisNAV: number;
  dagitim: number;
}

export const Fund_return_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  baslangicNAV: z.number().min(0).default(10),
  bitisNAV: z.number().min(0).default(12),
  dagitim: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fund_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input["bitisNAV"] + input["dagitim"] - input["baslangicNAV"]) / Math.max(1, input["baslangicNAV"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateFund_return_calculator(input: Fund_return_calculatorInput): Fund_return_calculatorOutput {
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

export interface Fund_return_calculatorOutput {
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

export const Fund_return_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

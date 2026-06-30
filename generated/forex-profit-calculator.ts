// Auto-generated from forex-profit-calculator-schema.json
import * as z from 'zod';

export interface Forex_profit_calculatorInput {
  dataConfidence?: number;
  lot: number;
  pipDegeri: number;
  pipHareketi: number;
}

export const Forex_profit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  lot: z.number().min(0.01).default(1),
  pipDegeri: z.number().min(0).default(10),
  pipHareketi: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Forex_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["lot"] * input["pipDegeri"] * input["pipHareketi"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateForex_profit_calculator(input: Forex_profit_calculatorInput): Forex_profit_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Forex_profit_calculatorOutput {
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

export const Forex_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;

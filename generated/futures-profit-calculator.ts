// Auto-generated from futures-profit-calculator-schema.json
import * as z from 'zod';

export interface Futures_profit_calculatorInput {
  dataConfidence?: number;
  girisFiyati: number;
  cikisFiyati: number;
  carpan: number;
  lot: number;
}

export const Futures_profit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  girisFiyati: z.number().min(0).default(100),
  cikisFiyati: z.number().min(0).default(105),
  carpan: z.number().min(1).default(100),
  lot: z.number().min(1).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Futures_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["cikisFiyati"] - input["girisFiyati"]) * input["carpan"] * input["lot"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateFutures_profit_calculator(input: Futures_profit_calculatorInput): Futures_profit_calculatorOutput {
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

export interface Futures_profit_calculatorOutput {
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

export const Futures_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;

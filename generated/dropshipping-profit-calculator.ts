// Auto-generated from dropshipping-profit-calculator-schema.json
import * as z from 'zod';

export interface Dropshipping_profit_calculatorInput {
  dataConfidence?: number;
  satis: number;
  tedarik: number;
  kargo: number;
  reklam: number;
}

export const Dropshipping_profit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  satis: z.number().min(0).default(300),
  tedarik: z.number().min(0).default(120),
  kargo: z.number().min(0).default(30),
  reklam: z.number().min(0).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dropshipping_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["satis"] - input["tedarik"] - input["kargo"] - input["reklam"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDropshipping_profit_calculator(input: Dropshipping_profit_calculatorInput): Dropshipping_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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

export interface Dropshipping_profit_calculatorOutput {
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

export const Dropshipping_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;

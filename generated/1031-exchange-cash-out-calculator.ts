// Auto-generated from 1031-exchange-cash-out-calculator-schema.json
import * as z from 'zod';

export interface _1031_exchange_cash_out_calculatorInput {
  dataConfidence?: number;
  satisFiyati: number;
  kalanBorc: number;
  yeniYatirim: number;
}

export const _1031_exchange_cash_out_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  satisFiyati: z.number().min(0).default(2000000),
  kalanBorc: z.number().min(0).default(500000),
  yeniYatirim: z.number().min(0).default(1800000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _1031_exchange_cash_out_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["satisFiyati"] - input["kalanBorc"]; results["nakitCikis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nakitCikis"] = Number.NaN; }
  try { const v = Math.max(0, (input["satisFiyati"] - input["kalanBorc"]) - input["yeniYatirim"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculate_1031_exchange_cash_out_calculator(input: _1031_exchange_cash_out_calculatorInput): _1031_exchange_cash_out_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "nakitCikis": toNumericFormulaValue(values["nakitCikis"])
  };
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

export interface _1031_exchange_cash_out_calculatorOutput {
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

export const _1031_exchange_cash_out_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["nakitCikis"],
} as const;

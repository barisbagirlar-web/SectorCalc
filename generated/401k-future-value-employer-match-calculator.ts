// Auto-generated from 401k-future-value-employer-match-calculator-schema.json
import * as z from 'zod';

export interface _401k_future_value_employer_match_calculatorInput {
  dataConfidence?: number;
  maas: number;
  katkiOrani: number;
  isverenEslesme: number;
  faiz: number;
  yil: number;
}

export const _401k_future_value_employer_match_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  maas: z.number().min(0).default(100000),
  katkiOrani: z.number().min(0).default(10),
  isverenEslesme: z.number().min(0).default(5),
  faiz: z.number().min(0).default(7),
  yil: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _401k_future_value_employer_match_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["maas"] * ((input["katkiOrani"] + input["isverenEslesme"]) / 100); results["yillikKatki"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yillikKatki"] = Number.NaN; }
  try { const v = (input["maas"] * ((input["katkiOrani"] + input["isverenEslesme"]) / 100)) * ((Math.pow(1 + input["faiz"] / 100, input["yil"]) - 1) / Math.max(0.0001, (input["faiz"] / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculate_401k_future_value_employer_match_calculator(input: _401k_future_value_employer_match_calculatorInput): _401k_future_value_employer_match_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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

export interface _401k_future_value_employer_match_calculatorOutput {
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

export const _401k_future_value_employer_match_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["yillikKatki"],
} as const;

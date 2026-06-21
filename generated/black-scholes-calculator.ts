// Auto-generated from black-scholes-calculator-schema.json
import * as z from 'zod';

export interface Black_scholes_calculatorInput {
  S: number;
  K: number;
  r: number;
  t: number;
  v: number;
  dataConfidence?: number;
}

export const Black_scholes_calculatorInputSchema = z.object({
  S: z.number().min(0).default(100),
  K: z.number().min(0).default(110),
  r: z.number().min(0).default(8),
  t: z.number().min(0.0001).default(1),
  v: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Black_scholes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.log(input.S / Math.max(1, input.K)) + (input.r / 100 + Math.pow(input.v / 100, 2) / 2) * input.t) / (Math.max(0.0001, input.v / 100) * Math.sqrt(Math.max(0.0001, input.t))); results["d1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d1"] = Number.NaN; }
  try { const v = input.S * 0.5 - input.K * Math.exp(-(input.r / 100) * input.t) * 0.5; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBlack_scholes_calculator(input: Black_scholes_calculatorInput): Black_scholes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Black_scholes_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Black_scholes_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;


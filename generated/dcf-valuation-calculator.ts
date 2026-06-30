// Auto-generated from dcf-valuation-calculator-schema.json
import * as z from 'zod';

export interface Dcf_valuation_calculatorInput {
  dataConfidence?: number;
  fcf1: number;
  fcf2: number;
  fcf3: number;
  fcf4: number;
  fcf5: number;
  WACC: number;
  terminalBuyume: number;
}

export const Dcf_valuation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  fcf1: z.number().min(0).default(100000),
  fcf2: z.number().min(0).default(110000),
  fcf3: z.number().min(0).default(121000),
  fcf4: z.number().min(0).default(133100),
  fcf5: z.number().min(0).default(146410),
  WACC: z.number().min(0).default(12),
  terminalBuyume: z.number().min(0).default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dcf_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["fcf1"] / Math.pow(1 + input["WACC"] / 100, 1); results["fcf_bd1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcf_bd1"] = Number.NaN; }
  try { const v = input["fcf2"] / Math.pow(1 + input["WACC"] / 100, 2); results["fcf_bd2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcf_bd2"] = Number.NaN; }
  try { const v = input["fcf3"] / Math.pow(1 + input["WACC"] / 100, 3); results["fcf_bd3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcf_bd3"] = Number.NaN; }
  try { const v = input["fcf4"] / Math.pow(1 + input["WACC"] / 100, 4); results["fcf_bd4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcf_bd4"] = Number.NaN; }
  try { const v = input["fcf5"] / Math.pow(1 + input["WACC"] / 100, 5); results["fcf_bd5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcf_bd5"] = Number.NaN; }
  try { const v = input["fcf5"] * (1 + input["terminalBuyume"] / 100) / Math.max(0.0001, (input["WACC"] / 100 - input["terminalBuyume"] / 100)); results["tv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tv"] = Number.NaN; }
  try { const v = input["fcf5"] * (1 + input["terminalBuyume"] / 100) / Math.max(0.0001, (input["WACC"] / 100 - input["terminalBuyume"] / 100)) / Math.pow(1 + input["WACC"] / 100, 5); results["tv_bd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tv_bd"] = Number.NaN; }
  try { const v = input["fcf1"] / Math.pow(1 + input["WACC"]/100, 1) + input["fcf2"] / Math.pow(1 + input["WACC"]/100, 2) + input["fcf3"] / Math.pow(1 + input["WACC"]/100, 3) + input["fcf4"] / Math.pow(1 + input["WACC"]/100, 4) + input["fcf5"] / Math.pow(1 + input["WACC"]/100, 5) + (input["fcf5"] * (1 + input["terminalBuyume"]/100) / Math.max(0.0001, (input["WACC"]/100 - input["terminalBuyume"]/100))) / Math.pow(1 + input["WACC"]/100, 5); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDcf_valuation_calculator(input: Dcf_valuation_calculatorInput): Dcf_valuation_calculatorOutput {
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

export interface Dcf_valuation_calculatorOutput {
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

export const Dcf_valuation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["fcf_bd1","fcf_bd2","fcf_bd3","fcf_bd4","fcf_bd5","tv","tv_bd"],
} as const;

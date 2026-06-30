// Auto-generated from line-balancing-calculator-schema.json
import * as z from 'zod';

export interface Line_balancing_calculatorInput {
  dataConfidence?: number;
  toplamIs: number;
  taktTime: number;
  istasyonSayisi: number;
}

export const Line_balancing_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  toplamIs: z.number().min(0).default(500),
  taktTime: z.number().min(0).default(50),
  istasyonSayisi: z.number().min(1).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Line_balancing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["toplamIs"] / Math.max(0.0001, (input["istasyonSayisi"] * input["taktTime"]))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLine_balancing_calculator(input: Line_balancing_calculatorInput): Line_balancing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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

export interface Line_balancing_calculatorOutput {
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

export const Line_balancing_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

// Auto-generated from sewing-line-balancing-calculator-schema.json
import * as z from 'zod';

export interface Sewing_line_balancing_calculatorInput {
  dataConfidence?: number;
  smvToplam: number;
  taktTime: number;
  operator: number;
}

export const Sewing_line_balancing_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  smvToplam: z.number().min(0).default(120),
  taktTime: z.number().min(0).default(10),
  operator: z.number().min(1).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sewing_line_balancing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["smvToplam"] / Math.max(0.0001, (input["operator"] * input["taktTime"]))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSewing_line_balancing_calculator(input: Sewing_line_balancing_calculatorInput): Sewing_line_balancing_calculatorOutput {
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

export interface Sewing_line_balancing_calculatorOutput {
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

export const Sewing_line_balancing_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

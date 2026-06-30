// Auto-generated from load-factor-calculator-schema.json
import * as z from 'zod';

export interface Load_factor_calculatorInput {
  dataConfidence?: number;
  ortalamaGuc: number;
  pikGuc: number;
}

export const Load_factor_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ortalamaGuc: z.number().min(0).default(80),
  pikGuc: z.number().min(0).default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Load_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["ortalamaGuc"] / Math.max(0.0001, input["pikGuc"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLoad_factor_calculator(input: Load_factor_calculatorInput): Load_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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

export interface Load_factor_calculatorOutput {
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

export const Load_factor_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

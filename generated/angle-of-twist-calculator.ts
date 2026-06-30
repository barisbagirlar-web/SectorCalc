// Auto-generated from angle-of-twist-calculator-schema.json
import * as z from 'zod';

export interface Angle_of_twist_calculatorInput {
  dataConfidence?: number;
  tork: number;
  uzunluk: number;
  kaymaModulu: number;
  kutupsalAtalet: number;
}

export const Angle_of_twist_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  tork: z.number().min(0).default(1000),
  uzunluk: z.number().min(0).default(2),
  kaymaModulu: z.number().min(0).default(80000000000),
  kutupsalAtalet: z.number().min(0).default(6.14e-7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Angle_of_twist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["tork"] * input["uzunluk"]) / Math.max(0.0001, (input["kaymaModulu"] * input["kutupsalAtalet"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAngle_of_twist_calculator(input: Angle_of_twist_calculatorInput): Angle_of_twist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "rad",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Angle_of_twist_calculatorOutput {
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

export const Angle_of_twist_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad",
  breakdownKeys: [],
} as const;

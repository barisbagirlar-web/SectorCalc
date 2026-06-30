// Auto-generated from timber-beam-shear-calculator-schema.json
import * as z from 'zod';

export interface Timber_beam_shear_calculatorInput {
  dataConfidence?: number;
  kesmeKuvveti: number;
  genislik: number;
  yukseklik: number;
}

export const Timber_beam_shear_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kesmeKuvveti: z.number().min(0).default(20000),
  genislik: z.number().min(0).default(0.15),
  yukseklik: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Timber_beam_shear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1.5 * input["kesmeKuvveti"]) / Math.max(0.0001, (input["genislik"] * input["yukseklik"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateTimber_beam_shear_calculator(input: Timber_beam_shear_calculatorInput): Timber_beam_shear_calculatorOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Timber_beam_shear_calculatorOutput {
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

export const Timber_beam_shear_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;

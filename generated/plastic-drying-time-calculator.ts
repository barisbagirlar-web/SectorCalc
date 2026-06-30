// Auto-generated from plastic-drying-time-calculator-schema.json
import * as z from 'zod';

export interface Plastic_drying_time_calculatorInput {
  dataConfidence?: number;
  malzemeKutle: number;
  nemOrani: number;
  havaDebi: number;
  nemAlmaKapasite: number;
}

export const Plastic_drying_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  malzemeKutle: z.number().min(0).default(50),
  nemOrani: z.number().min(0).default(0.5),
  havaDebi: z.number().min(0).default(0.5),
  nemAlmaKapasite: z.number().min(0).default(0.005),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plastic_drying_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["malzemeKutle"] * (input["nemOrani"] / 100)) / Math.max(0.0001, (input["havaDebi"] * input["nemAlmaKapasite"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePlastic_drying_time_calculator(input: Plastic_drying_time_calculatorInput): Plastic_drying_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Plastic_drying_time_calculatorOutput {
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

export const Plastic_drying_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: [],
} as const;

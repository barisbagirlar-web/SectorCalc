// Auto-generated from undamped-spring-mass-angular-frequency-calculator-schema.json
import * as z from 'zod';

export interface Undamped_spring_mass_angular_frequency_calculatorInput {
  dataConfidence?: number;
  kutle: number;
  yayKatsayisi: number;
}

export const Undamped_spring_mass_angular_frequency_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kutle: z.number().min(0).default(10),
  yayKatsayisi: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Undamped_spring_mass_angular_frequency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, input["yayKatsayisi"] / Math.max(0.0001, input["kutle"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateUndamped_spring_mass_angular_frequency_calculator(input: Undamped_spring_mass_angular_frequency_calculatorInput): Undamped_spring_mass_angular_frequency_calculatorOutput {
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
    unit: "rad/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Undamped_spring_mass_angular_frequency_calculatorOutput {
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

export const Undamped_spring_mass_angular_frequency_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad/s",
  breakdownKeys: [],
} as const;

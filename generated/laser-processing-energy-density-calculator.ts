// Auto-generated from laser-processing-energy-density-calculator-schema.json
import * as z from 'zod';

export interface Laser_processing_energy_density_calculatorInput {
  dataConfidence?: number;
  lazerGuc: number;
  kesmeHiz: number;
  malzemeKalinlik: number;
}

export const Laser_processing_energy_density_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  lazerGuc: z.number().min(0).default(4000),
  kesmeHiz: z.number().min(0).default(0.05),
  malzemeKalinlik: z.number().min(0).default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Laser_processing_energy_density_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["lazerGuc"] / Math.max(0.0001, (input["kesmeHiz"] * input["malzemeKalinlik"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLaser_processing_energy_density_calculator(input: Laser_processing_energy_density_calculatorInput): Laser_processing_energy_density_calculatorOutput {
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
    unit: "J/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Laser_processing_energy_density_calculatorOutput {
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

export const Laser_processing_energy_density_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "J/m2",
  breakdownKeys: [],
} as const;

// Auto-generated from thin-walled-pressure-vessel-hoop-stress-calculator-schema.json
import * as z from 'zod';

export interface Thin_walled_pressure_vessel_hoop_stress_calculatorInput {
  basinc: number;
  cap: number;
  kalinlik: number;
  dataConfidence?: number;
}

export const Thin_walled_pressure_vessel_hoop_stress_calculatorInputSchema = z.object({
  basinc: z.number().min(0).default(500000),
  cap: z.number().min(0).default(0.3),
  kalinlik: z.number().min(0).default(0.003),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Thin_walled_pressure_vessel_hoop_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.basinc * input.cap) / Math.max(0.0001, (2 * input.kalinlik)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateThin_walled_pressure_vessel_hoop_stress_calculator(input: Thin_walled_pressure_vessel_hoop_stress_calculatorInput): Thin_walled_pressure_vessel_hoop_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Thin_walled_pressure_vessel_hoop_stress_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Thin_walled_pressure_vessel_hoop_stress_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;


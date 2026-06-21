// Auto-generated from lens-power-calculator-schema.json
import * as z from 'zod';

export interface Lens_power_calculatorInput {
  odakUzaklik: number;
  dataConfidence?: number;
}

export const Lens_power_calculatorInputSchema = z.object({
  odakUzaklik: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lens_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / Math.max(0.0001, input.odakUzaklik); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLens_power_calculator(input: Lens_power_calculatorInput): Lens_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "m^-1",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lens_power_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lens_power_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m^-1",
  breakdownKeys: ["sonuc"],
} as const;


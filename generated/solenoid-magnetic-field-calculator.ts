// Auto-generated from solenoid-magnetic-field-calculator-schema.json
import * as z from 'zod';

export interface Solenoid_magnetic_field_calculatorInput {
  akim: number;
  sarimSayisi: number;
  uzunluk: number;
  dataConfidence?: number;
}

export const Solenoid_magnetic_field_calculatorInputSchema = z.object({
  akim: z.number().min(0).default(2),
  sarimSayisi: z.number().min(0).default(500),
  uzunluk: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Solenoid_magnetic_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (4 * Math.PI * 1e-7 * input.sarimSayisi * input.akim) / Math.max(0.0001, input.uzunluk); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSolenoid_magnetic_field_calculator(input: Solenoid_magnetic_field_calculatorInput): Solenoid_magnetic_field_calculatorOutput {
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
    unit: "T",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Solenoid_magnetic_field_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Solenoid_magnetic_field_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "T",
  breakdownKeys: ["sonuc"],
} as const;


// Auto-generated from ideal-gas-law-calculator-schema.json
import * as z from 'zod';

export interface Ideal_gas_law_calculatorInput {
  dataConfidence?: number;
  basinc: number;
  hacim: number;
  mol: number;
  sicaklik: number;
}

export const Ideal_gas_law_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  basinc: z.number().min(0).default(101325),
  hacim: z.number().min(0).default(0.024),
  mol: z.number().min(0).default(1),
  sicaklik: z.number().min(0).default(293),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ideal_gas_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 8.314; results["R"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["R"] = Number.NaN; }
  try { const v = (input["basinc"] * input["hacim"]) / (input["mol"] * 8.314 * input["sicaklik"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateIdeal_gas_law_calculator(input: Ideal_gas_law_calculatorInput): Ideal_gas_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "K",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Ideal_gas_law_calculatorOutput {
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

export const Ideal_gas_law_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "K",
  breakdownKeys: ["R"],
} as const;

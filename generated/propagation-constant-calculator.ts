// Auto-generated from propagation-constant-calculator-schema.json
import * as z from 'zod';

export interface Propagation_constant_calculatorInput {
  dataConfidence?: number;
  direnc: number;
  induktans: number;
  kapasite: number;
  frekans: number;
}

export const Propagation_constant_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  direnc: z.number().min(0).default(0.01),
  induktans: z.number().min(0).default(0.000001),
  kapasite: z.number().min(0).default(1e-12),
  frekans: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Propagation_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.PI * input["frekans"]; results["w"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["w"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, (input["direnc"] + 0 + input["induktans"] * 2 * Math.PI * input["frekans"]) * (0 + 0 + input["kapasite"] * 2 * Math.PI * input["frekans"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePropagation_constant_calculator(input: Propagation_constant_calculatorInput): Propagation_constant_calculatorOutput {
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
    unit: "Np/m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Propagation_constant_calculatorOutput {
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

export const Propagation_constant_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Np/m",
  breakdownKeys: ["w"],
} as const;

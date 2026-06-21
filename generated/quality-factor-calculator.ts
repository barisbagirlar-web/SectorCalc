// Auto-generated from quality-factor-calculator-schema.json
import * as z from 'zod';

export interface Quality_factor_calculatorInput {
  rezonansFrekans: number;
  bantGenislik: number;
  dataConfidence?: number;
}

export const Quality_factor_calculatorInputSchema = z.object({
  rezonansFrekans: z.number().min(0).default(1000000),
  bantGenislik: z.number().min(0).default(20000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quality_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rezonansFrekans / Math.max(0.0001, input.bantGenislik); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateQuality_factor_calculator(input: Quality_factor_calculatorInput): Quality_factor_calculatorOutput {
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
    unit: "Q",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Quality_factor_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Quality_factor_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Q",
  breakdownKeys: ["sonuc"],
} as const;


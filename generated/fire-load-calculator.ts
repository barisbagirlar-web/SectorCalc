// Auto-generated from fire-load-calculator-schema.json
import * as z from 'zod';

export interface Fire_load_calculatorInput {
  dataConfidence?: number;
  yaniciKutle: number;
  isilDeger: number;
  katAlani: number;
}

export const Fire_load_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yaniciKutle: z.number().min(0).default(5000),
  isilDeger: z.number().min(0).default(18),
  katAlani: z.number().min(0).default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fire_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["yaniciKutle"] * input["isilDeger"]) / Math.max(0.0001, input["katAlani"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateFire_load_calculator(input: Fire_load_calculatorInput): Fire_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "MJ/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Fire_load_calculatorOutput {
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

export const Fire_load_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "MJ/m2",
  breakdownKeys: [],
} as const;

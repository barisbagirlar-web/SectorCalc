// Auto-generated from surface-roughness-calculator-schema.json
import * as z from 'zod';

export interface Surface_roughness_calculatorInput {
  dataConfidence?: number;
  ilerleme: number;
  ucYariCap: number;
}

export const Surface_roughness_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ilerleme: z.number().min(0).default(0.1),
  ucYariCap: z.number().min(0).default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_roughness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(input["ilerleme"], 2)) / Math.max(0.0001, (32 * input["ucYariCap"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSurface_roughness_calculator(input: Surface_roughness_calculatorInput): Surface_roughness_calculatorOutput {
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Surface_roughness_calculatorOutput {
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

export const Surface_roughness_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "mm",
  breakdownKeys: [],
} as const;

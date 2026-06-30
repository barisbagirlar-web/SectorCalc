// Auto-generated from minimum-weld-throat-thickness-calculator-schema.json
import * as z from 'zod';

export interface Minimum_weld_throat_thickness_calculatorInput {
  dataConfidence?: number;
  yuk: number;
  kaynakBoyu: number;
  kaynakGerilmesi: number;
}

export const Minimum_weld_throat_thickness_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yuk: z.number().min(0).default(50000),
  kaynakBoyu: z.number().min(0).default(0.1),
  kaynakGerilmesi: z.number().min(0).default(120000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Minimum_weld_throat_thickness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yuk"] / Math.max(0.0001, (input["kaynakBoyu"] * input["kaynakGerilmesi"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMinimum_weld_throat_thickness_calculator(input: Minimum_weld_throat_thickness_calculatorInput): Minimum_weld_throat_thickness_calculatorOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Minimum_weld_throat_thickness_calculatorOutput {
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

export const Minimum_weld_throat_thickness_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;

// Auto-generated from body-fat-percentage-navy-method-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_percentage_navy_method_calculatorInput {
  dataConfidence?: number;
  boy: number;
  bel: number;
  boyun: number;
}

export const Body_fat_percentage_navy_method_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  boy: z.number().min(0).default(175),
  bel: z.number().min(0).default(85),
  boyun: z.number().min(0).default(38),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_fat_percentage_navy_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 495 / Math.max(0.0001, (1.0324 - 0.19077 * Math.log(Math.max(1, input["bel"] - input["boyun"])) / Math.log(10) + 0.15456 * Math.log(Math.max(1, input["boy"])) / Math.log(10))) - 450; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBody_fat_percentage_navy_method_calculator(input: Body_fat_percentage_navy_method_calculatorInput): Body_fat_percentage_navy_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Body_fat_percentage_navy_method_calculatorOutput {
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

export const Body_fat_percentage_navy_method_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

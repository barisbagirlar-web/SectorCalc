// Auto-generated from sitting-height-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sitting_height_ratio_calculatorInput {
  sittingHeightCm: number;
  sittingHeightMm: number;
  standingHeightCm: number;
  standingHeightMm: number;
  dataConfidence?: number;
}

export const Sitting_height_ratio_calculatorInputSchema = z.object({
  sittingHeightCm: z.number().default(90),
  sittingHeightMm: z.number().default(0),
  standingHeightCm: z.number().default(170),
  standingHeightMm: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sitting_height_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sittingHeightCm + input.sittingHeightMm / 10; results["totalSittingHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSittingHeight"] = Number.NaN; }
  try { const v = input.standingHeightCm + input.standingHeightMm / 10; results["totalStandingHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalStandingHeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSittingHeight"])) / (toNumericFormulaValue(results["totalStandingHeight"])); results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ratio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ratio"])) * 100; results["percentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentage"] = Number.NaN; }
  return results;
}


export function calculateSitting_height_ratio_calculator(input: Sitting_height_ratio_calculatorInput): Sitting_height_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ratio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sitting_height_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

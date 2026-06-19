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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sitting_height_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sittingHeightCm + input.sittingHeightMm / 10; results["totalSittingHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSittingHeight"] = 0; }
  try { const v = input.standingHeightCm + input.standingHeightMm / 10; results["totalStandingHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStandingHeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalSittingHeight"])) / (asFormulaNumber(results["totalStandingHeight"])); results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = (asFormulaNumber(results["ratio"])) * 100; results["percentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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

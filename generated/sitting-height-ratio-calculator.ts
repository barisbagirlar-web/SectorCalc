// Auto-generated from sitting-height-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sitting_height_ratio_calculatorInput {
  sittingHeightCm: number;
  sittingHeightMm: number;
  standingHeightCm: number;
  standingHeightMm: number;
}

export const Sitting_height_ratio_calculatorInputSchema = z.object({
  sittingHeightCm: z.number().default(90),
  sittingHeightMm: z.number().default(0),
  standingHeightCm: z.number().default(170),
  standingHeightMm: z.number().default(0),
});

function evaluateAllFormulas(input: Sitting_height_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sittingHeightCm + input.sittingHeightMm / 10; results["totalSittingHeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalSittingHeight"] = 0; }
  try { const v = input.standingHeightCm + input.standingHeightMm / 10; results["totalStandingHeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalStandingHeight"] = 0; }
  try { const v = (results["totalSittingHeight"] ?? 0) / (results["totalStandingHeight"] ?? 0); results["ratio"] = Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = (results["ratio"] ?? 0) * 100; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  return results;
}


export function calculateSitting_height_ratio_calculator(input: Sitting_height_ratio_calculatorInput): Sitting_height_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ratio"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

// Auto-generated from tennis-racquet-calculator-schema.json
import * as z from 'zod';

export interface Tennis_racquet_calculatorInput {
  racquetMass: number;
  racquetBalance: number;
  racquetSwingWeight: number;
  addedMass: number;
  addedPosition: number;
}

export const Tennis_racquet_calculatorInputSchema = z.object({
  racquetMass: z.number().default(300),
  racquetBalance: z.number().default(32),
  racquetSwingWeight: z.number().default(320),
  addedMass: z.number().default(5),
  addedPosition: z.number().default(68.5),
});

function evaluateAllFormulas(input: Tennis_racquet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.racquetMass + input.addedMass; results["newMass"] = Number.isFinite(v) ? v : 0; } catch { results["newMass"] = 0; }
  try { const v = (input.racquetMass * input.racquetBalance + input.addedMass * input.addedPosition) / (input.racquetMass + input.addedMass); results["newBalance"] = Number.isFinite(v) ? v : 0; } catch { results["newBalance"] = 0; }
  try { const v = input.racquetSwingWeight + (input.addedMass / 1000) * Math.pow(input.addedPosition - 10, 2); results["newSwingWeight"] = Number.isFinite(v) ? v : 0; } catch { results["newSwingWeight"] = 0; }
  return results;
}


export function calculateTennis_racquet_calculator(input: Tennis_racquet_calculatorInput): Tennis_racquet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["newSwingWeight"] ?? 0;
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


export interface Tennis_racquet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

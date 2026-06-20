// Auto-generated from tennis-racquet-calculator-schema.json
import * as z from 'zod';

export interface Tennis_racquet_calculatorInput {
  racquetMass: number;
  racquetBalance: number;
  racquetSwingWeight: number;
  addedMass: number;
  addedPosition: number;
  dataConfidence?: number;
}

export const Tennis_racquet_calculatorInputSchema = z.object({
  racquetMass: z.number().default(300),
  racquetBalance: z.number().default(32),
  racquetSwingWeight: z.number().default(320),
  addedMass: z.number().default(5),
  addedPosition: z.number().default(68.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tennis_racquet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.racquetMass + input.addedMass; results["newMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newMass"] = Number.NaN; }
  try { const v = (input.racquetMass * input.racquetBalance + input.addedMass * input.addedPosition) / (input.racquetMass + input.addedMass); results["newBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newBalance"] = Number.NaN; }
  return results;
}


export function calculateTennis_racquet_calculator(input: Tennis_racquet_calculatorInput): Tennis_racquet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["newBalance"]);
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


export interface Tennis_racquet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

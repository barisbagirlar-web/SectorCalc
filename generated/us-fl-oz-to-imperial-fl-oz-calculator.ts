// Auto-generated from us-fl-oz-to-imperial-fl-oz-calculator-schema.json
import * as z from 'zod';

export interface Us_fl_oz_to_imperial_fl_oz_calculatorInput {
  usFlOz: number;
  batchSize: number;
  packageCount: number;
  tolerance: number;
}

export const Us_fl_oz_to_imperial_fl_oz_calculatorInputSchema = z.object({
  usFlOz: z.number().default(1),
  batchSize: z.number().default(100),
  packageCount: z.number().default(1),
  tolerance: z.number().default(0.5),
});

function evaluateAllFormulas(input: Us_fl_oz_to_imperial_fl_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.040842731; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.usFlOz * (results["conversionFactor"] ?? 0); results["imperialFlOz"] = Number.isFinite(v) ? v : 0; } catch { results["imperialFlOz"] = 0; }
  try { const v = (results["imperialFlOz"] ?? 0) * input.batchSize * input.packageCount; results["totalImperialFlOz"] = Number.isFinite(v) ? v : 0; } catch { results["totalImperialFlOz"] = 0; }
  try { const v = (results["totalImperialFlOz"] ?? 0) * (1 - input.tolerance/100); results["minTotal"] = Number.isFinite(v) ? v : 0; } catch { results["minTotal"] = 0; }
  try { const v = (results["totalImperialFlOz"] ?? 0) * (1 + input.tolerance/100); results["maxTotal"] = Number.isFinite(v) ? v : 0; } catch { results["maxTotal"] = 0; }
  return results;
}


export function calculateUs_fl_oz_to_imperial_fl_oz_calculator(input: Us_fl_oz_to_imperial_fl_oz_calculatorInput): Us_fl_oz_to_imperial_fl_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalImperialFlOz"] ?? 0;
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


export interface Us_fl_oz_to_imperial_fl_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

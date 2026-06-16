// Auto-generated from runoff-calculator-schema.json
import * as z from 'zod';

export interface Runoff_calculatorInput {
  catchmentArea: number;
  runoffCoefficient: number;
  rainfallIntensity: number;
  safetyFactor: number;
}

export const Runoff_calculatorInputSchema = z.object({
  catchmentArea: z.number(),
  runoffCoefficient: z.number(),
  rainfallIntensity: z.number(),
  safetyFactor: z.number(),
});

function evaluateAllFormulas(input: Runoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runoffCoefficient * input.rainfallIntensity * input.catchmentArea / 3600; results["runoffBase"] = Number.isFinite(v) ? v : 0; } catch { results["runoffBase"] = 0; }
  try { const v = (results["runoffBase"] ?? 0) * input.safetyFactor; results["runoffLps"] = Number.isFinite(v) ? v : 0; } catch { results["runoffLps"] = 0; }
  try { const v = (results["runoffLps"] ?? 0) / 1000; results["runoffM3s"] = Number.isFinite(v) ? v : 0; } catch { results["runoffM3s"] = 0; }
  return results;
}


export function calculateRunoff_calculator(input: Runoff_calculatorInput): Runoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["runoffLps"] ?? 0;
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


export interface Runoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from suds-calculator-schema.json
import * as z from 'zod';

export interface Suds_calculatorInput {
  catchmentArea: number;
  rainfallIntensity: number;
  runoffCoefficient: number;
  stormDuration: number;
  safetyFactor: number;
}

export const Suds_calculatorInputSchema = z.object({
  catchmentArea: z.number().default(1000),
  rainfallIntensity: z.number().default(50),
  runoffCoefficient: z.number().default(0.9),
  stormDuration: z.number().default(60),
  safetyFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Suds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stormDuration / 60; results["durationHours"] = Number.isFinite(v) ? v : 0; } catch { results["durationHours"] = 0; }
  try { const v = (input.rainfallIntensity * (results["durationHours"] ?? 0)) / 1000; results["rainfallDepthM"] = Number.isFinite(v) ? v : 0; } catch { results["rainfallDepthM"] = 0; }
  try { const v = input.catchmentArea * (results["rainfallDepthM"] ?? 0) * input.runoffCoefficient; results["runoffVolume"] = Number.isFinite(v) ? v : 0; } catch { results["runoffVolume"] = 0; }
  try { const v = (results["runoffVolume"] ?? 0) * input.safetyFactor; results["requiredStorage"] = Number.isFinite(v) ? v : 0; } catch { results["requiredStorage"] = 0; }
  return results;
}


export function calculateSuds_calculator(input: Suds_calculatorInput): Suds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredStorage"] ?? 0;
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


export interface Suds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

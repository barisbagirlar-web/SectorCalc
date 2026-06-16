// Auto-generated from weight-set-point-calculator-schema.json
import * as z from 'zod';

export interface Weight_set_point_calculatorInput {
  nominalNetWeight: number;
  processStandardDeviation: number;
  minimumLegalNetWeight: number;
  safetyFactorZ: number;
  tareWeight: number;
}

export const Weight_set_point_calculatorInputSchema = z.object({
  nominalNetWeight: z.number().default(500),
  processStandardDeviation: z.number().default(5),
  minimumLegalNetWeight: z.number().default(485),
  safetyFactorZ: z.number().default(1.645),
  tareWeight: z.number().default(0),
});

function evaluateAllFormulas(input: Weight_set_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.minimumLegalNetWeight + input.safetyFactorZ * input.processStandardDeviation; results["minFillWeight"] = Number.isFinite(v) ? v : 0; } catch { results["minFillWeight"] = 0; }
  try { const v = (input.nominalNetWeight + (results["minFillWeight"] ?? 0) + Math.sqrt((input.nominalNetWeight - (results["minFillWeight"] ?? 0)) ** 2)) / 2; results["netSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["netSetPoint"] = 0; }
  try { const v = (results["netSetPoint"] ?? 0) - input.minimumLegalNetWeight; results["overfillAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overfillAmount"] = 0; }
  try { const v = (results["netSetPoint"] ?? 0) + input.tareWeight; results["grossSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["grossSetPoint"] = 0; }
  return results;
}


export function calculateWeight_set_point_calculator(input: Weight_set_point_calculatorInput): Weight_set_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netSetPoint"] ?? 0;
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


export interface Weight_set_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

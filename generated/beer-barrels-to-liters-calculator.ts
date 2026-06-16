// Auto-generated from beer-barrels-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Beer_barrels_to_liters_calculatorInput {
  barrels: number;
  litersPerBarrel: number;
  temperatureC: number;
  referenceTemperatureC: number;
  thermalExpansionCoefficient: number;
  correctionFactor: number;
}

export const Beer_barrels_to_liters_calculatorInputSchema = z.object({
  barrels: z.number().default(1),
  litersPerBarrel: z.number().default(117.3478),
  temperatureC: z.number().default(20),
  referenceTemperatureC: z.number().default(20),
  thermalExpansionCoefficient: z.number().default(0.0003),
  correctionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Beer_barrels_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrels * input.litersPerBarrel; results["volumeAtReference"] = Number.isFinite(v) ? v : 0; } catch { results["volumeAtReference"] = 0; }
  try { const v = 1 + input.thermalExpansionCoefficient * (input.temperatureC - input.referenceTemperatureC); results["temperatureCorrectionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureCorrectionFactor"] = 0; }
  try { const v = (results["volumeAtReference"] ?? 0) * (results["temperatureCorrectionFactor"] ?? 0); results["volumeAfterTemperatureCorrection"] = Number.isFinite(v) ? v : 0; } catch { results["volumeAfterTemperatureCorrection"] = 0; }
  try { const v = (results["volumeAfterTemperatureCorrection"] ?? 0) * input.correctionFactor; results["volumeLiters"] = Number.isFinite(v) ? v : 0; } catch { results["volumeLiters"] = 0; }
  return results;
}


export function calculateBeer_barrels_to_liters_calculator(input: Beer_barrels_to_liters_calculatorInput): Beer_barrels_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volumeLiters"] ?? 0;
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


export interface Beer_barrels_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

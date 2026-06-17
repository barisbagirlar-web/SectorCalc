// Auto-generated from nd-filter-calculator-schema.json
import * as z from 'zod';

export interface Nd_filter_calculatorInput {
  numerator: number;
  denominator: number;
  ndStops: number;
  od: number;
}

export const Nd_filter_calculatorInputSchema = z.object({
  numerator: z.number().default(1),
  denominator: z.number().default(125),
  ndStops: z.number().default(0),
  od: z.number().default(0),
});

function evaluateAllFormulas(input: Nd_filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numerator / input.denominator; results["baseShutter"] = Number.isFinite(v) ? v : 0; } catch { results["baseShutter"] = 0; }
  try { const v = input.ndStops > 0 ? input.ndStops : (input.od > 0 ? input.od / 0.3 : 0); results["effectiveStops"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveStops"] = 0; }
  try { const v = Math.pow(2, (results["effectiveStops"] ?? 0)); results["filterFactor"] = Number.isFinite(v) ? v : 0; } catch { results["filterFactor"] = 0; }
  try { const v = (results["baseShutter"] ?? 0) * (results["filterFactor"] ?? 0); results["newExposureTime"] = Number.isFinite(v) ? v : 0; } catch { results["newExposureTime"] = 0; }
  results["__filterFactor_toFixed_2__x"] = 0;
  results["__effectiveStops__stop"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateNd_filter_calculator(input: Nd_filter_calculatorInput): Nd_filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Nd_filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

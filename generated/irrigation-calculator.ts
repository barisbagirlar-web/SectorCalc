// Auto-generated from irrigation-calculator-schema.json
import * as z from 'zod';

export interface Irrigation_calculatorInput {
  area: number;
  cropWater: number;
  efficiency: number;
  peakFactor: number;
  systemLosses: number;
  operatingHours: number;
}

export const Irrigation_calculatorInputSchema = z.object({
  area: z.number().default(1),
  cropWater: z.number().default(5),
  efficiency: z.number().default(75),
  peakFactor: z.number().default(1.2),
  systemLosses: z.number().default(5),
  operatingHours: z.number().default(12),
});

function evaluateAllFormulas(input: Irrigation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.area * input.cropWater * 100000 * input.peakFactor) / (input.efficiency * (100 - input.systemLosses)); results["totalDailyVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalDailyVolume"] = 0; }
  try { const v = ((input.area * input.cropWater * 100000 * input.peakFactor) / (input.efficiency * (100 - input.systemLosses))) / input.operatingHours; results["requiredFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["requiredFlowRate"] = 0; }
  try { const v = input.area * input.cropWater * 10; results["rawWaterRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["rawWaterRequirement"] = 0; }
  return results;
}


export function calculateIrrigation_calculator(input: Irrigation_calculatorInput): Irrigation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDailyVolume"] ?? 0;
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


export interface Irrigation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from watershed-calculator-schema.json
import * as z from 'zod';

export interface Watershed_calculatorInput {
  drainageArea: number;
  runoffCoefficient: number;
  rainfallIntensity: number;
  channelLength: number;
  slope: number;
}

export const Watershed_calculatorInputSchema = z.object({
  drainageArea: z.number().default(10),
  runoffCoefficient: z.number().default(0.5),
  rainfallIntensity: z.number().default(25),
  channelLength: z.number().default(500),
  slope: z.number().default(0.01),
});

function evaluateAllFormulas(input: Watershed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.runoffCoefficient * input.rainfallIntensity * input.drainageArea) / 360; results["peakDischarge"] = Number.isFinite(v) ? v : 0; } catch { results["peakDischarge"] = 0; }
  try { const v = 0.01947 * Math.pow(input.channelLength, 0.77) * Math.pow(input.slope, -0.385); results["timeOfConcentration"] = Number.isFinite(v) ? v : 0; } catch { results["timeOfConcentration"] = 0; }
  try { const v = input.rainfallIntensity * input.drainageArea * 10; results["runoffVolumePerHour"] = Number.isFinite(v) ? v : 0; } catch { results["runoffVolumePerHour"] = 0; }
  return results;
}


export function calculateWatershed_calculator(input: Watershed_calculatorInput): Watershed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["peakDischarge"] ?? 0;
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


export interface Watershed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

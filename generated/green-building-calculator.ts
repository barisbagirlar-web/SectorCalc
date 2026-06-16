// Auto-generated from green-building-calculator-schema.json
import * as z from 'zod';

export interface Green_building_calculatorInput {
  floorArea: number;
  electricity: number;
  gridFactor: number;
  gas: number;
  gasFactor: number;
  renewable: number;
}

export const Green_building_calculatorInputSchema = z.object({
  floorArea: z.number().default(1000),
  electricity: z.number().default(50000),
  gridFactor: z.number().default(0.475),
  gas: z.number().default(10000),
  gasFactor: z.number().default(0.184),
  renewable: z.number().default(10000),
});

function evaluateAllFormulas(input: Green_building_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * input.gridFactor; results["electricityCarbon"] = Number.isFinite(v) ? v : 0; } catch { results["electricityCarbon"] = 0; }
  try { const v = input.gas * input.gasFactor; results["gasCarbon"] = Number.isFinite(v) ? v : 0; } catch { results["gasCarbon"] = 0; }
  try { const v = input.renewable * input.gridFactor; results["renewableSaved"] = Number.isFinite(v) ? v : 0; } catch { results["renewableSaved"] = 0; }
  try { const v = input.electricity * input.gridFactor + input.gas * input.gasFactor - input.renewable * input.gridFactor; results["netCarbon"] = Number.isFinite(v) ? v : 0; } catch { results["netCarbon"] = 0; }
  return results;
}


export function calculateGreen_building_calculator(input: Green_building_calculatorInput): Green_building_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCarbon"] ?? 0;
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


export interface Green_building_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

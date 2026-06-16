// Auto-generated from water-conservation-calculator-schema.json
import * as z from 'zod';

export interface Water_conservation_calculatorInput {
  currentConsumption: number;
  baselineConsumption: number;
  waterCostPerCubicMeter: number;
  leakagePercentage: number;
  efficiencyImprovementPercentage: number;
}

export const Water_conservation_calculatorInputSchema = z.object({
  currentConsumption: z.number().default(1000),
  baselineConsumption: z.number().default(1200),
  waterCostPerCubicMeter: z.number().default(2.5),
  leakagePercentage: z.number().default(5),
  efficiencyImprovementPercentage: z.number().default(10),
});

function evaluateAllFormulas(input: Water_conservation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentConsumption * (input.leakagePercentage / 100); results["waterWasteFromLeaks"] = Number.isFinite(v) ? v : 0; } catch { results["waterWasteFromLeaks"] = 0; }
  try { const v = input.baselineConsumption * (input.efficiencyImprovementPercentage / 100); results["efficiencySavings"] = Number.isFinite(v) ? v : 0; } catch { results["efficiencySavings"] = 0; }
  try { const v = (results["efficiencySavings"] ?? 0) + (results["waterWasteFromLeaks"] ?? 0); results["totalPotentialWaterSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalPotentialWaterSavings"] = 0; }
  try { const v = (results["totalPotentialWaterSavings"] ?? 0) * input.waterCostPerCubicMeter; results["costSavings"] = Number.isFinite(v) ? v : 0; } catch { results["costSavings"] = 0; }
  return results;
}


export function calculateWater_conservation_calculator(input: Water_conservation_calculatorInput): Water_conservation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPotentialWaterSavings"] ?? 0;
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


export interface Water_conservation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

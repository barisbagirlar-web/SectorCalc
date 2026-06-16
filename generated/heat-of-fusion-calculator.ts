// Auto-generated from heat-of-fusion-calculator-schema.json
import * as z from 'zod';

export interface Heat_of_fusion_calculatorInput {
  mass: number;
  specificHeat: number;
  initialTemperature: number;
  meltingTemperature: number;
  latentHeatOfFusion: number;
}

export const Heat_of_fusion_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  specificHeat: z.number().default(4180),
  initialTemperature: z.number().default(20),
  meltingTemperature: z.number().default(0),
  latentHeatOfFusion: z.number().default(334000),
});

function evaluateAllFormulas(input: Heat_of_fusion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.specificHeat * Math.max(0, input.meltingTemperature - input.initialTemperature); results["sensibleHeat"] = Number.isFinite(v) ? v : 0; } catch { results["sensibleHeat"] = 0; }
  try { const v = input.mass * input.latentHeatOfFusion; results["latentHeat"] = Number.isFinite(v) ? v : 0; } catch { results["latentHeat"] = 0; }
  try { const v = (results["sensibleHeat"] ?? 0) + (results["latentHeat"] ?? 0); results["totalHeat"] = Number.isFinite(v) ? v : 0; } catch { results["totalHeat"] = 0; }
  return results;
}


export function calculateHeat_of_fusion_calculator(input: Heat_of_fusion_calculatorInput): Heat_of_fusion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalHeat"] ?? 0;
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


export interface Heat_of_fusion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

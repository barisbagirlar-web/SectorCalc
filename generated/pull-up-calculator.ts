// Auto-generated from pull-up-calculator-schema.json
import * as z from 'zod';

export interface Pull_up_calculatorInput {
  supplyVoltage: number;
  minHighVoltage: number;
  inputLeakageHigh: number;
  numberOfLoads: number;
  outputLowVoltage: number;
  outputSinkCurrent: number;
}

export const Pull_up_calculatorInputSchema = z.object({
  supplyVoltage: z.number().default(5),
  minHighVoltage: z.number().default(3.5),
  inputLeakageHigh: z.number().default(0.000001),
  numberOfLoads: z.number().default(1),
  outputLowVoltage: z.number().default(0.4),
  outputSinkCurrent: z.number().default(0.016),
});

function evaluateAllFormulas(input: Pull_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.supplyVoltage - input.minHighVoltage) / (input.numberOfLoads * input.inputLeakageHigh); results["maxPullUpResistance"] = Number.isFinite(v) ? v : 0; } catch { results["maxPullUpResistance"] = 0; }
  try { const v = (input.supplyVoltage - input.outputLowVoltage) / input.outputSinkCurrent; results["minPullUpResistance"] = Number.isFinite(v) ? v : 0; } catch { results["minPullUpResistance"] = 0; }
  return results;
}


export function calculatePull_up_calculator(input: Pull_up_calculatorInput): Pull_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxPullUpResistance"] ?? 0;
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


export interface Pull_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

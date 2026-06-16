// Auto-generated from pd-calculator-schema.json
import * as z from 'zod';

export interface Pd_calculatorInput {
  diameter: number;
  length: number;
  flowRate: number;
  density: number;
  viscosity: number;
  roughness: number;
}

export const Pd_calculatorInputSchema = z.object({
  diameter: z.number().default(0.1),
  length: z.number().default(100),
  flowRate: z.number().default(0.01),
  density: z.number().default(998.2),
  viscosity: z.number().default(0.001002),
  roughness: z.number().default(0.000046),
});

function evaluateAllFormulas(input: Pd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.diameter * input.diameter / 4; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.flowRate / (results["area"] ?? 0); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = (input.density * (results["velocity"] ?? 0) * input.diameter) / input.viscosity; results["reynoldsNumber"] = Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  try { const v = (input.roughness/(3.7*input.diameter)) + (5.74/Math.pow((results["reynoldsNumber"] ?? 0),0.9)); results["logArg"] = Number.isFinite(v) ? v : 0; } catch { results["logArg"] = 0; }
  try { const v = 0.25 / Math.pow( Math.log((results["logArg"] ?? 0)) / Math.LN10 , 2); results["frictionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["frictionFactor"] = 0; }
  try { const v = (results["frictionFactor"] ?? 0) * (input.length/input.diameter) * (input.density * (results["velocity"] ?? 0) * (results["velocity"] ?? 0) / 2); results["pressureDrop"] = Number.isFinite(v) ? v : 0; } catch { results["pressureDrop"] = 0; }
  return results;
}


export function calculatePd_calculator(input: Pd_calculatorInput): Pd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pressureDrop"] ?? 0;
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


export interface Pd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from ironman-calculator-schema.json
import * as z from 'zod';

export interface Ironman_calculatorInput {
  length: number;
  width: number;
  height: number;
  density: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Ironman_calculatorInputSchema = z.object({
  length: z.number().default(2),
  width: z.number().default(0.1),
  height: z.number().default(0.2),
  density: z.number().default(7850),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Ironman_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * input.height; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.width * Math.pow(input.height, 2) / 6; results["sectionModulus"] = Number.isFinite(v) ? v : 0; } catch { results["sectionModulus"] = 0; }
  try { const v = input.width * input.height * input.length; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = input.width * input.height * input.length * input.density; results["mass"] = Number.isFinite(v) ? v : 0; } catch { results["mass"] = 0; }
  try { const v = input.width * input.height * input.length * input.density * 9.81; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  try { const v = (input.yieldStrength * 1e6) * (input.width * Math.pow(input.height, 2) / 6) / input.safetyFactor; results["maxMoment"] = Number.isFinite(v) ? v : 0; } catch { results["maxMoment"] = 0; }
  try { const v = 8 * ((input.yieldStrength * 1e6) * (input.width * Math.pow(input.height, 2) / 6) / input.safetyFactor) / Math.pow(input.length, 2); results["maxUniformLoad"] = Number.isFinite(v) ? v : 0; } catch { results["maxUniformLoad"] = 0; }
  try { const v = 8 * ((input.yieldStrength * 1e6) * (input.width * Math.pow(input.height, 2) / 6) / input.safetyFactor) / input.length; results["maxTotalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["maxTotalLoad"] = 0; }
  try { const v = input.width * input.height * input.length * input.density * 9.81; results["width___height___length___density___9_81"] = Number.isFinite(v) ? v : 0; } catch { results["width___height___length___density___9_81"] = 0; }
  try { const v = (input.yieldStrength * 1e6) * (input.width * Math.pow(input.height, 2) / 6) / input.safetyFactor; results["_yieldStrength___1e6_____width___Math_po"] = Number.isFinite(v) ? v : 0; } catch { results["_yieldStrength___1e6_____width___Math_po"] = 0; }
  try { const v = 8 * ((input.yieldStrength * 1e6) * (input.width * Math.pow(input.height, 2) / 6) / input.safetyFactor) / input.length; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateIronman_calculator(input: Ironman_calculatorInput): Ironman_calculatorOutput {
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


export interface Ironman_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

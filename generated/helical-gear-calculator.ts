// Auto-generated from helical-gear-calculator-schema.json
import * as z from 'zod';

export interface Helical_gear_calculatorInput {
  mn: number;
  z: number;
  beta: number;
  alpha: number;
  ha: number;
  c: number;
}

export const Helical_gear_calculatorInputSchema = z.object({
  mn: z.number().default(2),
  z: z.number().default(20),
  beta: z.number().default(15),
  alpha: z.number().default(20),
  ha: z.number().default(1),
  c: z.number().default(0.25),
});

function evaluateAllFormulas(input: Helical_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mn * input.z) / Math.cos(input.beta * Math.PI / 180); results["pitchDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["pitchDiameter"] = 0; }
  try { const v = (input.mn * input.z) / Math.cos(input.beta * Math.PI / 180) + 2 * input.ha * input.mn; results["outsideDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["outsideDiameter"] = 0; }
  try { const v = (input.mn * input.z) / Math.cos(input.beta * Math.PI / 180) - 2 * (input.ha + input.c) * input.mn; results["rootDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["rootDiameter"] = 0; }
  try { const v = input.mn / Math.cos(input.beta * Math.PI / 180); results["transverseModule"] = Number.isFinite(v) ? v : 0; } catch { results["transverseModule"] = 0; }
  try { const v = Math.PI * input.mn; results["normalCircularPitch"] = Number.isFinite(v) ? v : 0; } catch { results["normalCircularPitch"] = 0; }
  try { const v = Math.PI * (input.mn / Math.cos(input.beta * Math.PI / 180)); results["transverseCircularPitch"] = Number.isFinite(v) ? v : 0; } catch { results["transverseCircularPitch"] = 0; }
  return results;
}


export function calculateHelical_gear_calculator(input: Helical_gear_calculatorInput): Helical_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pitchDiameter"] ?? 0;
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


export interface Helical_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

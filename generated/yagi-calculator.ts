// Auto-generated from yagi-calculator-schema.json
import * as z from 'zod';

export interface Yagi_calculatorInput {
  frequency: number;
  numElements: number;
  velocityFactor: number;
  spacingFactor: number;
}

export const Yagi_calculatorInputSchema = z.object({
  frequency: z.number().default(144),
  numElements: z.number().default(3),
  velocityFactor: z.number().default(0.95),
  spacingFactor: z.number().default(0.2),
});

function evaluateAllFormulas(input: Yagi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 300 / input.frequency; results["wavelength"] = Number.isFinite(v) ? v : 0; } catch { results["wavelength"] = 0; }
  try { const v = 0.5 * (results["wavelength"] ?? 0) * input.velocityFactor; results["drivenElement"] = Number.isFinite(v) ? v : 0; } catch { results["drivenElement"] = 0; }
  try { const v = (results["drivenElement"] ?? 0) * 1.05; results["reflectorLength"] = Number.isFinite(v) ? v : 0; } catch { results["reflectorLength"] = 0; }
  try { const v = input.numElements > 2 ? (results["drivenElement"] ?? 0) * Math.pow(0.95, 1) : 0; results["director1"] = Number.isFinite(v) ? v : 0; } catch { results["director1"] = 0; }
  try { const v = input.numElements > 3 ? (results["drivenElement"] ?? 0) * Math.pow(0.95, 2) : 0; results["director2"] = Number.isFinite(v) ? v : 0; } catch { results["director2"] = 0; }
  try { const v = input.numElements > 4 ? (results["drivenElement"] ?? 0) * Math.pow(0.95, 3) : 0; results["director3"] = Number.isFinite(v) ? v : 0; } catch { results["director3"] = 0; }
  try { const v = (input.numElements - 1) * input.spacingFactor * (results["wavelength"] ?? 0); results["boomLength"] = Number.isFinite(v) ? v : 0; } catch { results["boomLength"] = 0; }
  return results;
}


export function calculateYagi_calculator(input: Yagi_calculatorInput): Yagi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["boomLength"] ?? 0;
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


export interface Yagi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

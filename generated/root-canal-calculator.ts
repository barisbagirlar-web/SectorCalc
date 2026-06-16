// Auto-generated from root-canal-calculator-schema.json
import * as z from 'zod';

export interface Root_canal_calculatorInput {
  apicalDiameter: number;
  d16Diameter: number;
  workingLength: number;
  desiredOrificeDiameter: number;
}

export const Root_canal_calculatorInputSchema = z.object({
  apicalDiameter: z.number().default(0.15),
  d16Diameter: z.number().default(1),
  workingLength: z.number().default(22),
  desiredOrificeDiameter: z.number().default(1.2),
});

function evaluateAllFormulas(input: Root_canal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.d16Diameter - input.apicalDiameter) / 16; results["taper"] = Number.isFinite(v) ? v : 0; } catch { results["taper"] = 0; }
  try { const v = input.apicalDiameter + (results["taper"] ?? 0) * input.workingLength; results["actualOrificeDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["actualOrificeDiameter"] = 0; }
  try { const v = (input.desiredOrificeDiameter - input.apicalDiameter) / input.workingLength; results["requiredTaper"] = Number.isFinite(v) ? v : 0; } catch { results["requiredTaper"] = 0; }
  try { const v = Math.PI * input.workingLength / 12 * (Math.pow((results["actualOrificeDiameter"] ?? 0), 2) + (results["actualOrificeDiameter"] ?? 0) * input.apicalDiameter + Math.pow(input.apicalDiameter, 2)); results["canalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["canalVolume"] = 0; }
  return results;
}


export function calculateRoot_canal_calculator(input: Root_canal_calculatorInput): Root_canal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualOrificeDiameter"] ?? 0;
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


export interface Root_canal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

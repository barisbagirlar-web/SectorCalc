// Auto-generated from bbt-calculator-schema.json
import * as z from 'zod';

export interface Bbt_calculatorInput {
  speed: number;
  frictionCoeff: number;
  load: number;
  boreDiameter: number;
  ambientTemp: number;
  coolingCoeff: number;
}

export const Bbt_calculatorInputSchema = z.object({
  speed: z.number().default(1500),
  frictionCoeff: z.number().default(0.001),
  load: z.number().default(1000),
  boreDiameter: z.number().default(50),
  ambientTemp: z.number().default(20),
  coolingCoeff: z.number().default(5),
});

function evaluateAllFormulas(input: Bbt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.frictionCoeff * input.load * (Math.PI * input.boreDiameter * input.speed / 60) / 1000; results["powerLoss"] = Number.isFinite(v) ? v : 0; } catch { results["powerLoss"] = 0; }
  try { const v = (results["powerLoss"] ?? 0) / input.coolingCoeff; results["tempRise"] = Number.isFinite(v) ? v : 0; } catch { results["tempRise"] = 0; }
  try { const v = input.ambientTemp + (results["tempRise"] ?? 0); results["bearingTemp"] = Number.isFinite(v) ? v : 0; } catch { results["bearingTemp"] = 0; }
  return results;
}


export function calculateBbt_calculator(input: Bbt_calculatorInput): Bbt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bearingTemp"] ?? 0;
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


export interface Bbt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

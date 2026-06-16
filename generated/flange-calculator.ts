// Auto-generated from flange-calculator-schema.json
import * as z from 'zod';

export interface Flange_calculatorInput {
  outerDiameter: number;
  thickness: number;
  boltCircleDiameter: number;
  numberOfBolts: number;
  boltHoleDiameter: number;
  density: number;
}

export const Flange_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(200),
  thickness: z.number().default(20),
  boltCircleDiameter: z.number().default(160),
  numberOfBolts: z.number().default(8),
  boltHoleDiameter: z.number().default(18),
  density: z.number().default(7850),
});

function evaluateAllFormulas(input: Flange_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.outerDiameter, 2) / 4 * input.thickness; results["solidVolume"] = Number.isFinite(v) ? v : 0; } catch { results["solidVolume"] = 0; }
  try { const v = input.numberOfBolts * Math.PI * Math.pow(input.boltHoleDiameter, 2) / 4 * input.thickness; results["totalHoleVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalHoleVolume"] = 0; }
  try { const v = (Math.PI * Math.pow(input.outerDiameter, 2) / 4 - input.numberOfBolts * Math.PI * Math.pow(input.boltHoleDiameter, 2) / 4) * input.thickness * input.density / 1000000000; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  return results;
}


export function calculateFlange_calculator(input: Flange_calculatorInput): Flange_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weight"] ?? 0;
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


export interface Flange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

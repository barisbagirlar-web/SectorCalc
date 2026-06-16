// Auto-generated from cure-calculator-schema.json
import * as z from 'zod';

export interface Cure_calculatorInput {
  curingTemperature: number;
  curingTimeHours: number;
  datumTemperature: number;
  strengthCoefficientA: number;
  strengthCoefficientB: number;
}

export const Cure_calculatorInputSchema = z.object({
  curingTemperature: z.number().default(20),
  curingTimeHours: z.number().default(168),
  datumTemperature: z.number().default(-10),
  strengthCoefficientA: z.number().default(20),
  strengthCoefficientB: z.number().default(10),
});

function evaluateAllFormulas(input: Cure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.curingTemperature - input.datumTemperature) * input.curingTimeHours); results["maturityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["maturityIndex"] = 0; }
  try { const v = input.strengthCoefficientA + input.strengthCoefficientB * Math.log((results["maturityIndex"] ?? 0) + 1); results["estimatedStrength"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedStrength"] = 0; }
  return results;
}


export function calculateCure_calculator(input: Cure_calculatorInput): Cure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedStrength"] ?? 0;
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


export interface Cure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

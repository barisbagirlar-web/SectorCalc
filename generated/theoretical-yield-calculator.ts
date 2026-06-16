// Auto-generated from theoretical-yield-calculator-schema.json
import * as z from 'zod';

export interface Theoretical_yield_calculatorInput {
  massOfReactant: number;
  molarMassReactant: number;
  stoichReactant: number;
  stoichProduct: number;
  molarMassProduct: number;
}

export const Theoretical_yield_calculatorInputSchema = z.object({
  massOfReactant: z.number().default(10),
  molarMassReactant: z.number().default(100),
  stoichReactant: z.number().default(1),
  stoichProduct: z.number().default(1),
  molarMassProduct: z.number().default(100),
});

function evaluateAllFormulas(input: Theoretical_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massOfReactant / input.molarMassReactant; results["molesReactant"] = Number.isFinite(v) ? v : 0; } catch { results["molesReactant"] = 0; }
  try { const v = (results["molesReactant"] ?? 0) * input.stoichProduct / input.stoichReactant; results["molesProduct"] = Number.isFinite(v) ? v : 0; } catch { results["molesProduct"] = 0; }
  try { const v = (results["molesProduct"] ?? 0) * input.molarMassProduct; results["theoreticalYieldMass"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalYieldMass"] = 0; }
  return results;
}


export function calculateTheoretical_yield_calculator(input: Theoretical_yield_calculatorInput): Theoretical_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["theoreticalYieldMass"] ?? 0;
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


export interface Theoretical_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

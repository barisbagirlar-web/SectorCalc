// Auto-generated from selectivity-calculator-schema.json
import * as z from 'zod';

export interface Selectivity_calculatorInput {
  massReactantFed: number;
  molarMassReactant: number;
  conversion: number;
  massDesired: number;
  molarMassDesired: number;
  massUndesired: number;
  molarMassUndesired: number;
}

export const Selectivity_calculatorInputSchema = z.object({
  massReactantFed: z.number().default(100),
  molarMassReactant: z.number().default(50),
  conversion: z.number().default(0.5),
  massDesired: z.number().default(40),
  molarMassDesired: z.number().default(80),
  massUndesired: z.number().default(20),
  molarMassUndesired: z.number().default(60),
});

function evaluateAllFormulas(input: Selectivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massReactantFed / input.molarMassReactant; results["molesReactantFed"] = Number.isFinite(v) ? v : 0; } catch { results["molesReactantFed"] = 0; }
  try { const v = (results["molesReactantFed"] ?? 0) * input.conversion; results["molesReactantConsumed"] = Number.isFinite(v) ? v : 0; } catch { results["molesReactantConsumed"] = 0; }
  try { const v = input.massDesired / input.molarMassDesired; results["molesDesired"] = Number.isFinite(v) ? v : 0; } catch { results["molesDesired"] = 0; }
  try { const v = input.massUndesired / input.molarMassUndesired; results["molesUndesired"] = Number.isFinite(v) ? v : 0; } catch { results["molesUndesired"] = 0; }
  try { const v = (results["molesDesired"] ?? 0) / (results["molesUndesired"] ?? 0); results["selectivity"] = Number.isFinite(v) ? v : 0; } catch { results["selectivity"] = 0; }
  try { const v = (results["molesDesired"] ?? 0) / (results["molesReactantFed"] ?? 0); results["yield"] = Number.isFinite(v) ? v : 0; } catch { results["yield"] = 0; }
  return results;
}


export function calculateSelectivity_calculator(input: Selectivity_calculatorInput): Selectivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["selectivity"] ?? 0;
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


export interface Selectivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from theoretical-yield-calculator-schema.json
import * as z from 'zod';

export interface Theoretical_yield_calculatorInput {
  massOfReactant: number;
  molarMassReactant: number;
  stoichReactant: number;
  stoichProduct: number;
  molarMassProduct: number;
  dataConfidence?: number;
}

export const Theoretical_yield_calculatorInputSchema = z.object({
  massOfReactant: z.number().default(10),
  molarMassReactant: z.number().default(100),
  stoichReactant: z.number().default(1),
  stoichProduct: z.number().default(1),
  molarMassProduct: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Theoretical_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massOfReactant / input.molarMassReactant; results["molesReactant"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesReactant"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["molesReactant"])) * input.stoichProduct / input.stoichReactant; results["molesProduct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesProduct"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["molesProduct"])) * input.molarMassProduct; results["theoreticalYieldMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalYieldMass"] = Number.NaN; }
  return results;
}


export function calculateTheoretical_yield_calculator(input: Theoretical_yield_calculatorInput): Theoretical_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["theoreticalYieldMass"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

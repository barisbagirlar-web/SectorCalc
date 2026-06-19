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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Theoretical_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massOfReactant / input.molarMassReactant; results["molesReactant"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["molesReactant"] = 0; }
  try { const v = (asFormulaNumber(results["molesReactant"])) * input.stoichProduct / input.stoichReactant; results["molesProduct"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["molesProduct"] = 0; }
  try { const v = (asFormulaNumber(results["molesProduct"])) * input.molarMassProduct; results["theoreticalYieldMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theoreticalYieldMass"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTheoretical_yield_calculator(input: Theoretical_yield_calculatorInput): Theoretical_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["theoreticalYieldMass"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

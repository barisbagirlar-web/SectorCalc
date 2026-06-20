// Auto-generated from tsiolkovsky-equation-calculator-schema.json
import * as z from 'zod';

export interface Tsiolkovsky_equation_calculatorInput {
  exhaustVelocity: number;
  initialMass: number;
  finalMass: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Tsiolkovsky_equation_calculatorInputSchema = z.object({
  exhaustVelocity: z.number().default(3000),
  initialMass: z.number().default(50000),
  finalMass: z.number().default(10000),
  safetyFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tsiolkovsky_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialMass / input.finalMass; results["massRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massRatio"] = Number.NaN; }
  try { const v = input.initialMass / input.finalMass; results["massRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massRatio_aux"] = Number.NaN; }
  return results;
}


export function calculateTsiolkovsky_equation_calculator(input: Tsiolkovsky_equation_calculatorInput): Tsiolkovsky_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massRatio_aux"]);
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


export interface Tsiolkovsky_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

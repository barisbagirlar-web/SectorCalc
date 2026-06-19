// Auto-generated from strength-training-calculator-schema.json
import * as z from 'zod';

export interface Strength_training_calculatorInput {
  weightLifted: number;
  repetitions: number;
  bodyWeight: number;
  sets: number;
  restPeriod: number;
  fatigueFactor: number;
  dataConfidence?: number;
}

export const Strength_training_calculatorInputSchema = z.object({
  weightLifted: z.number().default(100),
  repetitions: z.number().default(10),
  bodyWeight: z.number().default(75),
  sets: z.number().default(3),
  restPeriod: z.number().default(60),
  fatigueFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Strength_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightLifted * (1 + input.repetitions / 30); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.weightLifted; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStrength_training_calculator(input: Strength_training_calculatorInput): Strength_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown"]);
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


export interface Strength_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

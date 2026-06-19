// Auto-generated from permanent-teeth-calculator-schema.json
import * as z from 'zod';

export interface Permanent_teeth_calculatorInput {
  age: number;
  extracted: number;
  missing: number;
  wisdomOverride: number;
  dataConfidence?: number;
}

export const Permanent_teeth_calculatorInputSchema = z.object({
  age: z.number().default(25),
  extracted: z.number().default(0),
  missing: z.number().default(0),
  wisdomOverride: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Permanent_teeth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wisdomOverride == 1) ? 32 : ( (input.age < 6) ? 0 : ((input.age <= 12) ? (input.age - 6) / 6 * 28 : ((input.age <= 21) ? 28 + (input.age - 12) / 9 * 4 : 32) ) ); results["expectedTeeth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedTeeth"] = 0; }
  try { const v = (input.wisdomOverride == 1) ? 32 : ( (input.age < 6) ? 0 : ((input.age <= 12) ? (input.age - 6) / 6 * 28 : ((input.age <= 21) ? 28 + (input.age - 12) / 9 * 4 : 32) ) ); results["expectedTeeth_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedTeeth_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePermanent_teeth_calculator(input: Permanent_teeth_calculatorInput): Permanent_teeth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["expectedTeeth_aux"]));
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


export interface Permanent_teeth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

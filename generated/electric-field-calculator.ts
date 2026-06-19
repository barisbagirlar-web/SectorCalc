// Auto-generated from electric-field-calculator-schema.json
import * as z from 'zod';

export interface Electric_field_calculatorInput {
  Q1: number;
  r1: number;
  Q2: number;
  r2: number;
  theta: number;
  epsilon_r: number;
  dataConfidence?: number;
}

export const Electric_field_calculatorInputSchema = z.object({
  Q1: z.number().default(0.000001),
  r1: z.number().default(1),
  Q2: z.number().default(-0.000001),
  r2: z.number().default(1),
  theta: z.number().default(90),
  epsilon_r: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Electric_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1/(4*Math.PI*8.854e-12*input.epsilon_r); results["k"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = input.theta*Math.PI/180; results["thetaRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateElectric_field_calculator(input: Electric_field_calculatorInput): Electric_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["thetaRad"]));
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


export interface Electric_field_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

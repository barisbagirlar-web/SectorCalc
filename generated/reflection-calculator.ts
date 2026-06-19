// Auto-generated from reflection-calculator-schema.json
import * as z from 'zod';

export interface Reflection_calculatorInput {
  incidentAngle: number;
  n1: number;
  n2: number;
  wavelength: number;
  dataConfidence?: number;
}

export const Reflection_calculatorInputSchema = z.object({
  incidentAngle: z.number().default(30),
  n1: z.number().default(1),
  n2: z.number().default(1.5),
  wavelength: z.number().default(550),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.incidentAngle * Math.PI / 180; results["theta1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theta1"] = 0; }
  try { const v = input.incidentAngle * Math.PI / 180; results["theta1_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theta1_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReflection_calculator(input: Reflection_calculatorInput): Reflection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["theta1_aux"]));
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


export interface Reflection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

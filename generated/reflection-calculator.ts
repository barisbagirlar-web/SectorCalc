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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.incidentAngle) * (input.n1) * (input.n2) * (input.wavelength); results["theta1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theta1"] = Number.NaN; }
  try { const v = (input.incidentAngle) * (input.n1) * (input.n2); results["theta1_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theta1_aux"] = Number.NaN; }
  return results;
}


export function calculateReflection_calculator(input: Reflection_calculatorInput): Reflection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["theta1_aux"]);
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


export interface Reflection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

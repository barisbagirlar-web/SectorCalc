// Auto-generated from pipe-stress-calculator-schema.json
import * as z from 'zod';

export interface Pipe_stress_calculatorInput {
  internalPressure: number;
  outerDiameter: number;
  wallThickness: number;
  yieldStrength: number;
  dataConfidence?: number;
}

export const Pipe_stress_calculatorInputSchema = z.object({
  internalPressure: z.number().default(10),
  outerDiameter: z.number().default(100),
  wallThickness: z.number().default(5),
  yieldStrength: z.number().default(250),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.internalPressure * input.outerDiameter / (2 * input.wallThickness); results["hoopStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hoopStress"] = 0; }
  try { const v = input.internalPressure * input.outerDiameter / (4 * input.wallThickness); results["longitudinalStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["longitudinalStress"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePipe_stress_calculator(input: Pipe_stress_calculatorInput): Pipe_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["longitudinalStress"]);
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


export interface Pipe_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from work-calculator-schema.json
import * as z from 'zod';

export interface Work_calculatorInput {
  mass: number;
  distance: number;
  angle: number;
  frictionCoefficient: number;
  dataConfidence?: number;
}

export const Work_calculatorInputSchema = z.object({
  mass: z.number().default(10),
  distance: z.number().default(5),
  angle: z.number().default(30),
  frictionCoefficient: z.number().default(0.1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Work_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass) * (input.distance) * (input.angle) * (input.frictionCoefficient); results["angleRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = (input.mass) * (input.distance) * (input.angle); results["angleRad_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angleRad_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWork_calculator(input: Work_calculatorInput): Work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["angleRad_aux"]));
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


export interface Work_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

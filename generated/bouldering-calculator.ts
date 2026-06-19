// Auto-generated from bouldering-calculator-schema.json
import * as z from 'zod';

export interface Bouldering_calculatorInput {
  bodyMass: number;
  fallHeight: number;
  matThickness: number;
  matStiffness: number;
  g: number;
  dataConfidence?: number;
}

export const Bouldering_calculatorInputSchema = z.object({
  bodyMass: z.number().default(70),
  fallHeight: z.number().default(2),
  matThickness: z.number().default(10),
  matStiffness: z.number().default(50),
  g: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bouldering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.matThickness / 100; results["matThicknessM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["matThicknessM"] = 0; }
  try { const v = input.matStiffness * 1000; results["matStiffnessNm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["matStiffnessNm"] = 0; }
  try { const v = input.bodyMass * input.g; results["mg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBouldering_calculator(input: Bouldering_calculatorInput): Bouldering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mg"]);
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


export interface Bouldering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

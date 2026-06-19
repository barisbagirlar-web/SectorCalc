// Auto-generated from column-buckling-calculator-schema.json
import * as z from 'zod';

export interface Column_buckling_calculatorInput {
  elasticModulus: number;
  momentInertia: number;
  area: number;
  length: number;
  effectiveLengthFactor: number;
  appliedLoad: number;
  dataConfidence?: number;
}

export const Column_buckling_calculatorInputSchema = z.object({
  elasticModulus: z.number().default(200000),
  momentInertia: z.number().default(1000000),
  area: z.number().default(5000),
  length: z.number().default(3000),
  effectiveLengthFactor: z.number().default(1),
  appliedLoad: z.number().default(50000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Column_buckling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI ** 2 * input.elasticModulus * input.momentInertia / ( (input.effectiveLengthFactor * input.length) ** 2 ); results["criticalLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["criticalLoad"] = 0; }
  try { const v = (asFormulaNumber(results["criticalLoad"])) / input.area; results["criticalStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["criticalStress"] = 0; }
  try { const v = (asFormulaNumber(results["criticalLoad"])) / input.appliedLoad; results["safetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateColumn_buckling_calculator(input: Column_buckling_calculatorInput): Column_buckling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["criticalLoad"]));
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


export interface Column_buckling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

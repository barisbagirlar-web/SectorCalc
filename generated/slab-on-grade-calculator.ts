// Auto-generated from slab-on-grade-calculator-schema.json
import * as z from 'zod';

export interface Slab_on_grade_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  concreteCost: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Slab_on_grade_calculatorInputSchema = z.object({
  length: z.number().default(5),
  width: z.number().default(4),
  thickness: z.number().default(100),
  concreteCost: z.number().default(100),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slab_on_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * (input.thickness / 1000); results["volumeWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeWithoutWaste"] = 0; }
  try { const v = 1 + (input.wasteFactor / 100); results["wasteMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["volumeWithoutWaste"])) * (asFormulaNumber(results["wasteMultiplier"])); results["concreteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["concreteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["concreteVolume"])) * input.concreteCost; results["concreteCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["concreteCostTotal"] = 0; }
  try { const v = (asFormulaNumber(results["concreteCostTotal"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSlab_on_grade_calculator(input: Slab_on_grade_calculatorInput): Slab_on_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Slab_on_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

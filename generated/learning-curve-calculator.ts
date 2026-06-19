// Auto-generated from learning-curve-calculator-schema.json
import * as z from 'zod';

export interface Learning_curve_calculatorInput {
  firstUnitCost: number;
  learningRate: number;
  unitNumber: number;
  batchSize: number;
  dataConfidence?: number;
}

export const Learning_curve_calculatorInputSchema = z.object({
  firstUnitCost: z.number().default(1000),
  learningRate: z.number().default(90),
  unitNumber: z.number().default(100),
  batchSize: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Learning_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unitNumber * input.firstUnitCost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.unitNumber * input.firstUnitCost * (1 + (input.learningRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.unitNumber * input.firstUnitCost * (1 + (input.learningRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLearning_curve_calculator(input: Learning_curve_calculatorInput): Learning_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Learning_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

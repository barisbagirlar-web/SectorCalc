// Auto-generated from learning-curve-calculator-schema.json
import * as z from 'zod';

export interface Learning_curve_calculatorInput {
  firstUnitCost: number;
  learningRate: number;
  unitNumber: number;
  batchSize: number;
}

export const Learning_curve_calculatorInputSchema = z.object({
  firstUnitCost: z.number().default(1000),
  learningRate: z.number().default(90),
  unitNumber: z.number().default(100),
  batchSize: z.number().default(1000),
});

function evaluateAllFormulas(input: Learning_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.learningRate / 100) / Math.log(2); results["exponent"] = Number.isFinite(v) ? v : 0; } catch { results["exponent"] = 0; }
  try { const v = input.firstUnitCost * Math.pow(input.unitNumber, Math.log(input.learningRate / 100) / Math.log(2)); results["unitCost"] = Number.isFinite(v) ? v : 0; } catch { results["unitCost"] = 0; }
  try { const v = input.firstUnitCost * ((Math.pow(input.batchSize + 0.5, (Math.log(input.learningRate / 100) / Math.log(2)) + 1) - Math.pow(0.5, (Math.log(input.learningRate / 100) / Math.log(2)) + 1)) / ((Math.log(input.learningRate / 100) / Math.log(2)) + 1)); results["totalBatchCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalBatchCost"] = 0; }
  return results;
}


export function calculateLearning_curve_calculator(input: Learning_curve_calculatorInput): Learning_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["unitCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

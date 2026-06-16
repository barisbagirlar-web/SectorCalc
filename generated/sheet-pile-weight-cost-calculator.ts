// Auto-generated from sheet-pile-weight-cost-calculator-schema.json
import * as z from 'zod';

export interface Sheet_pile_weight_cost_calculatorInput {
  pileWidth: number;
  pileLength: number;
  numberOfPiles: number;
  weightPerArea: number;
  costPerTon: number;
  wasteFactor: number;
}

export const Sheet_pile_weight_cost_calculatorInputSchema = z.object({
  pileWidth: z.number().default(0.6),
  pileLength: z.number().default(12),
  numberOfPiles: z.number().default(100),
  weightPerArea: z.number().default(120),
  costPerTon: z.number().default(900),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Sheet_pile_weight_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pileWidth * input.pileLength * input.numberOfPiles * (1 + input.wasteFactor / 100); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) * input.weightPerArea / 1000; results["totalWeightTons"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightTons"] = 0; }
  try { const v = (results["totalWeightTons"] ?? 0) * input.costPerTon; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSheet_pile_weight_cost_calculator(input: Sheet_pile_weight_cost_calculatorInput): Sheet_pile_weight_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Sheet_pile_weight_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

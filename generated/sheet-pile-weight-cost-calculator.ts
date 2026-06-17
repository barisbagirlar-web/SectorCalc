// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sheet_pile_weight_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pileWidth * input.pileLength * input.numberOfPiles * (1 + input.wasteFactor / 100); results["totalArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalArea"])) * input.weightPerArea / 1000; results["totalWeightTons"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeightTons"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeightTons"])) * input.costPerTon; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSheet_pile_weight_cost_calculator(input: Sheet_pile_weight_cost_calculatorInput): Sheet_pile_weight_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

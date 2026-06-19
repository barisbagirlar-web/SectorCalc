// Auto-generated from cost-of-living-comparison-calculator-schema.json
import * as z from 'zod';

export interface Cost_of_living_comparison_calculatorInput {
  baseRent: number;
  baseUtilities: number;
  baseGroceries: number;
  baseTransport: number;
  baseMisc: number;
  targetIndex: number;
  dataConfidence?: number;
}

export const Cost_of_living_comparison_calculatorInputSchema = z.object({
  baseRent: z.number().default(1000),
  baseUtilities: z.number().default(200),
  baseGroceries: z.number().default(400),
  baseTransport: z.number().default(150),
  baseMisc: z.number().default(250),
  targetIndex: z.number().default(120),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_of_living_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseRent + input.baseUtilities + input.baseGroceries + input.baseTransport + input.baseMisc; results["totalBaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBaseCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalBaseCost"])) * input.targetIndex / 100; results["totalTargetCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTargetCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCost_of_living_comparison_calculator(input: Cost_of_living_comparison_calculatorInput): Cost_of_living_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTargetCost"]);
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


export interface Cost_of_living_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

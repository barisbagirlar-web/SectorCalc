// Auto-generated from sugar-calculator-schema.json
import * as z from 'zod';

export interface Sugar_calculatorInput {
  product_mass: number;
  target_sugar_pct: number;
  sugar_purity: number;
  sugar_price: number;
  batch_size: number;
  dataConfidence?: number;
}

export const Sugar_calculatorInputSchema = z.object({
  product_mass: z.number().default(1000),
  target_sugar_pct: z.number().default(10),
  sugar_purity: z.number().default(99.5),
  sugar_price: z.number().default(5),
  batch_size: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sugar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.product_mass * input.target_sugar_pct / 100; results["pure_sugar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pure_sugar"] = 0; }
  try { const v = (asFormulaNumber(results["pure_sugar"])) / (input.sugar_purity / 100); results["actual_sugar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["actual_sugar"] = 0; }
  try { const v = (asFormulaNumber(results["actual_sugar"])) * input.sugar_price * input.batch_size; results["total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSugar_calculator(input: Sugar_calculatorInput): Sugar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_cost"]));
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


export interface Sugar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

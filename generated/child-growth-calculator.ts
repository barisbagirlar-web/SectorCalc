// Auto-generated from child-growth-calculator-schema.json
import * as z from 'zod';

export interface Child_growth_calculatorInput {
  parentQuantity: number;
  bomMultiplier: number;
  scrapRate: number;
  safetyStockFactor: number;
  dataConfidence?: number;
}

export const Child_growth_calculatorInputSchema = z.object({
  parentQuantity: z.number().default(100),
  bomMultiplier: z.number().default(1),
  scrapRate: z.number().default(0),
  safetyStockFactor: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Child_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parentQuantity * input.bomMultiplier; results["grossRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossRequirement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossRequirement"])) / (1 - input.scrapRate / 100); results["netRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netRequirement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netRequirement"])) * (1 + input.safetyStockFactor / 100); results["finalRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalRequirement"] = Number.NaN; }
  return results;
}


export function calculateChild_growth_calculator(input: Child_growth_calculatorInput): Child_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalRequirement"]);
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


export interface Child_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

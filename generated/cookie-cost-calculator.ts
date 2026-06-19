// Auto-generated from cookie-cost-calculator-schema.json
import * as z from 'zod';

export interface Cookie_cost_calculatorInput {
  numberOfCookies: number;
  flourCost: number;
  sugarCost: number;
  butterCost: number;
  eggCost: number;
  chocolateCost: number;
  dataConfidence?: number;
}

export const Cookie_cost_calculatorInputSchema = z.object({
  numberOfCookies: z.number().default(24),
  flourCost: z.number().default(1.5),
  sugarCost: z.number().default(2),
  butterCost: z.number().default(5),
  eggCost: z.number().default(0.3),
  chocolateCost: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cookie_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flourCost * 0.5 + input.sugarCost * 0.3 + input.butterCost * 0.25 + input.eggCost * 2 + input.chocolateCost * 0.2) * (input.numberOfCookies / 12); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.numberOfCookies; results["costPerCookie"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerCookie"] = 0; }
  try { const v = (asFormulaNumber(results["costPerCookie"])) * 1.3; results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCookie_cost_calculator(input: Cookie_cost_calculatorInput): Cookie_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Cookie_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

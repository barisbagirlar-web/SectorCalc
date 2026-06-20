// Auto-generated from business-valuation-calculator-schema.json
import * as z from 'zod';

export interface Business_valuation_calculatorInput {
  revenue: number;
  expenses: number;
  growthRate: number;
  discountRate: number;
  assets: number;
  liabilities: number;
  dataConfidence?: number;
}

export const Business_valuation_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  expenses: z.number().default(800000),
  growthRate: z.number().default(3),
  discountRate: z.number().default(10),
  assets: z.number().default(500000),
  liabilities: z.number().default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Business_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.expenses; results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netProfit"])) / (input.discountRate/100 - input.growthRate/100); results["dcfValuation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dcfValuation"] = Number.NaN; }
  try { const v = input.assets - input.liabilities; results["assetBasedValuation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["assetBasedValuation"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["dcfValuation"])) + (toNumericFormulaValue(results["assetBasedValuation"]))) / 2; results["businessValuation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["businessValuation"] = Number.NaN; }
  return results;
}


export function calculateBusiness_valuation_calculator(input: Business_valuation_calculatorInput): Business_valuation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["businessValuation"]);
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


export interface Business_valuation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

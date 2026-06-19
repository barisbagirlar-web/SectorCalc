// Auto-generated from clv-calculator-schema.json
import * as z from 'zod';

export interface Clv_calculatorInput {
  averageOrderValue: number;
  orderFrequency: number;
  customerLifespan: number;
  profitMargin: number;
  discountRate: number;
  dataConfidence?: number;
}

export const Clv_calculatorInputSchema = z.object({
  averageOrderValue: z.number().default(100),
  orderFrequency: z.number().default(4),
  customerLifespan: z.number().default(3),
  profitMargin: z.number().default(25),
  discountRate: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Clv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.averageOrderValue * input.orderFrequency * (input.profitMargin / 100)); results["annualProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["annualProfit"])) * input.customerLifespan); results["totalProfitUndiscounted"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalProfitUndiscounted"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateClv_calculator(input: Clv_calculatorInput): Clv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalProfitUndiscounted"]);
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


export interface Clv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

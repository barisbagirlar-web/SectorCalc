// Auto-generated from dropshipping-profit-calculator-schema.json
import * as z from 'zod';

export interface Dropshipping_profit_calculatorInput {
  sellingPrice: number;
  costPrice: number;
  shippingCost: number;
  orderVolume: number;
  fixedCosts: number;
  feePercentage: number;
  dataConfidence?: number;
}

export const Dropshipping_profit_calculatorInputSchema = z.object({
  sellingPrice: z.number().default(50),
  costPrice: z.number().default(30),
  shippingCost: z.number().default(5),
  orderVolume: z.number().default(100),
  fixedCosts: z.number().default(200),
  feePercentage: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dropshipping_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.orderVolume; results["revenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = (input.costPrice + input.shippingCost) * input.orderVolume; results["totalCOGS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = input.sellingPrice * (input.feePercentage / 100) * input.orderVolume; results["totalFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (asFormulaNumber(results["revenue"])) - (asFormulaNumber(results["totalCOGS"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - (asFormulaNumber(results["totalFees"])) - input.fixedCosts; results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["netProfit"])) / (asFormulaNumber(results["revenue"]))) * 100; results["netProfitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDropshipping_profit_calculator(input: Dropshipping_profit_calculatorInput): Dropshipping_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netProfit"]));
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


export interface Dropshipping_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

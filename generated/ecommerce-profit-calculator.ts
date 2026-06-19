// Auto-generated from ecommerce-profit-calculator-schema.json
import * as z from 'zod';

export interface Ecommerce_profit_calculatorInput {
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  shippingCostPerUnit: number;
  marketingSpend: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Ecommerce_profit_calculatorInputSchema = z.object({
  sellingPrice: z.number().default(50),
  costPrice: z.number().default(30),
  quantity: z.number().default(100),
  shippingCostPerUnit: z.number().default(5),
  marketingSpend: z.number().default(200),
  taxRate: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ecommerce_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.quantity; results["revenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.costPrice * input.quantity; results["cogs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cogs"] = 0; }
  try { const v = (asFormulaNumber(results["revenue"])) - (asFormulaNumber(results["cogs"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.shippingCostPerUnit * input.quantity; results["shippingCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shippingCost"] = 0; }
  try { const v = input.marketingSpend; results["marketingSpend"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["marketingSpend"] = 0; }
  try { const v = ((asFormulaNumber(results["revenue"])) - (asFormulaNumber(results["cogs"])) - (asFormulaNumber(results["shippingCost"])) - input.marketingSpend) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["revenue"])) - (asFormulaNumber(results["cogs"])) - (asFormulaNumber(results["shippingCost"])) - input.marketingSpend - (asFormulaNumber(results["taxAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEcommerce_profit_calculator(input: Ecommerce_profit_calculatorInput): Ecommerce_profit_calculatorOutput {
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


export interface Ecommerce_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

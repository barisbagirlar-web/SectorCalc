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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ecommerce_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.quantity; results["revenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["revenue"] = Number.NaN; }
  try { const v = input.costPrice * input.quantity; results["cogs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cogs"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["revenue"])) - (toNumericFormulaValue(results["cogs"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = input.shippingCostPerUnit * input.quantity; results["shippingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shippingCost"] = Number.NaN; }
  try { const v = input.marketingSpend; results["marketingSpend"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marketingSpend"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["revenue"])) - (toNumericFormulaValue(results["cogs"])) - (toNumericFormulaValue(results["shippingCost"])) - input.marketingSpend) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["revenue"])) - (toNumericFormulaValue(results["cogs"])) - (toNumericFormulaValue(results["shippingCost"])) - input.marketingSpend - (toNumericFormulaValue(results["taxAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  return results;
}


export function calculateEcommerce_profit_calculator(input: Ecommerce_profit_calculatorInput): Ecommerce_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Ecommerce_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

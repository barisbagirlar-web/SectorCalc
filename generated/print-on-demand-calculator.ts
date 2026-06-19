// Auto-generated from print-on-demand-calculator-schema.json
import * as z from 'zod';

export interface Print_on_demand_calculatorInput {
  productCost: number;
  sellingPrice: number;
  quantity: number;
  shippingCost: number;
  platformFee: number;
  additionalCosts: number;
  dataConfidence?: number;
}

export const Print_on_demand_calculatorInputSchema = z.object({
  productCost: z.number().default(50),
  sellingPrice: z.number().default(100),
  quantity: z.number().default(100),
  shippingCost: z.number().default(20),
  platformFee: z.number().default(10),
  additionalCosts: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Print_on_demand_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.quantity; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (input.productCost + input.shippingCost) * input.quantity + (input.platformFee / 100) * (input.sellingPrice * input.quantity) + input.additionalCosts; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((asFormulaNumber(results["profit"])) / (asFormulaNumber(results["totalRevenue"]))) * 100; results["margin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["margin"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.sellingPrice; results["breakEvenUnits"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakEvenUnits"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePrint_on_demand_calculator(input: Print_on_demand_calculatorInput): Print_on_demand_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["profit"]);
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


export interface Print_on_demand_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

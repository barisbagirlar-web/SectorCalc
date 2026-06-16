// Auto-generated from print-on-demand-calculator-schema.json
import * as z from 'zod';

export interface Print_on_demand_calculatorInput {
  productCost: number;
  sellingPrice: number;
  quantity: number;
  shippingCost: number;
  platformFee: number;
  additionalCosts: number;
}

export const Print_on_demand_calculatorInputSchema = z.object({
  productCost: z.number().default(50),
  sellingPrice: z.number().default(100),
  quantity: z.number().default(100),
  shippingCost: z.number().default(20),
  platformFee: z.number().default(10),
  additionalCosts: z.number().default(0),
});

function evaluateAllFormulas(input: Print_on_demand_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.quantity; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (input.productCost + input.shippingCost) * input.quantity + (input.platformFee / 100) * (input.sellingPrice * input.quantity) + input.additionalCosts; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((results["profit"] ?? 0) / (results["totalRevenue"] ?? 0)) * 100; results["margin"] = Number.isFinite(v) ? v : 0; } catch { results["margin"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.sellingPrice; results["breakEvenUnits"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenUnits"] = 0; }
  return results;
}


export function calculatePrint_on_demand_calculator(input: Print_on_demand_calculatorInput): Print_on_demand_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["profit"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

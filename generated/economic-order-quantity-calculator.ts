// Auto-generated from economic-order-quantity-calculator-schema.json
import * as z from 'zod';

export interface Economic_order_quantity_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
}

export const Economic_order_quantity_calculatorInputSchema = z.object({
  annualDemand: z.number().default(10000),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  unitCost: z.number().default(10),
});

function evaluateAllFormulas(input: Economic_order_quantity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(2 * input.annualDemand * input.orderingCost / input.holdingCost); results["economicOrderQuantity"] = Number.isFinite(v) ? v : 0; } catch { results["economicOrderQuantity"] = 0; }
  try { const v = (input.annualDemand / (results["economicOrderQuantity"] ?? 0)) * input.orderingCost; results["totalAnnualOrderingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualOrderingCost"] = 0; }
  try { const v = ((results["economicOrderQuantity"] ?? 0) / 2) * input.holdingCost; results["totalAnnualHoldingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualHoldingCost"] = 0; }
  try { const v = input.annualDemand * input.unitCost; results["totalAnnualPurchaseCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualPurchaseCost"] = 0; }
  try { const v = (results["totalAnnualOrderingCost"] ?? 0) + (results["totalAnnualHoldingCost"] ?? 0) + (results["totalAnnualPurchaseCost"] ?? 0); results["totalAnnualInventoryCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualInventoryCost"] = 0; }
  return results;
}


export function calculateEconomic_order_quantity_calculator(input: Economic_order_quantity_calculatorInput): Economic_order_quantity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["economicOrderQuantity"] ?? 0;
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


export interface Economic_order_quantity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

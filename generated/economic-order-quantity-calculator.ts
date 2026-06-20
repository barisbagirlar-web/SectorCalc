// Auto-generated from economic-order-quantity-calculator-schema.json
import * as z from 'zod';

export interface Economic_order_quantity_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  dataConfidence?: number;
}

export const Economic_order_quantity_calculatorInputSchema = z.object({
  annualDemand: z.number().default(10000),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  unitCost: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Economic_order_quantity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand * input.unitCost; results["totalAnnualPurchaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualPurchaseCost"] = Number.NaN; }
  try { const v = input.annualDemand * input.unitCost; results["totalAnnualPurchaseCost_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualPurchaseCost_aux"] = Number.NaN; }
  return results;
}


export function calculateEconomic_order_quantity_calculator(input: Economic_order_quantity_calculatorInput): Economic_order_quantity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAnnualPurchaseCost_aux"]);
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


export interface Economic_order_quantity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

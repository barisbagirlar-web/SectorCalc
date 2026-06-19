// Auto-generated from customer-lifetime-value-calculator-schema.json
import * as z from 'zod';

export interface Customer_lifetime_value_calculatorInput {
  avgPurchaseValue: number;
  purchaseFrequency: number;
  lifespanYears: number;
  grossMarginPercent: number;
  dataConfidence?: number;
}

export const Customer_lifetime_value_calculatorInputSchema = z.object({
  avgPurchaseValue: z.number().default(100),
  purchaseFrequency: z.number().default(12),
  lifespanYears: z.number().default(5),
  grossMarginPercent: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Customer_lifetime_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avgPurchaseValue * input.purchaseFrequency * input.lifespanYears; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.avgPurchaseValue * input.purchaseFrequency * input.grossMarginPercent / 100; results["annualValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualValue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) * input.grossMarginPercent / 100; results["clv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["clv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCustomer_lifetime_value_calculator(input: Customer_lifetime_value_calculatorInput): Customer_lifetime_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["clv"]);
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


export interface Customer_lifetime_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from 1031-exchange-calculator-schema.json
import * as z from 'zod';

export interface _1031_exchange_calculatorInput {
  salePrice: number;
  mortgagePayoff: number;
  sellingCosts: number;
  purchasePrice: number;
  newMortgage: number;
  buyingCosts: number;
  dataConfidence?: number;
}

export const _1031_exchange_calculatorInputSchema = z.object({
  salePrice: z.number().default(500000),
  mortgagePayoff: z.number().default(300000),
  sellingCosts: z.number().default(30000),
  purchasePrice: z.number().default(600000),
  newMortgage: z.number().default(350000),
  buyingCosts: z.number().default(15000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _1031_exchange_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice - input.mortgagePayoff - input.sellingCosts; results["netProceeds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProceeds"] = 0; }
  try { const v = input.purchasePrice - input.newMortgage + input.buyingCosts; results["cashRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cashRequired"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_1031_exchange_calculator(input: _1031_exchange_calculatorInput): _1031_exchange_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cashRequired"]);
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


export interface _1031_exchange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

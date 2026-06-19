// Auto-generated from pokemon-card-calculator-schema.json
import * as z from 'zod';

export interface Pokemon_card_calculatorInput {
  marketPrice: number;
  conditionFactor: number;
  rarityMultiplier: number;
  gradingCost: number;
  sellingFeePercent: number;
  shippingCost: number;
  acquisitionCost: number;
  dataConfidence?: number;
}

export const Pokemon_card_calculatorInputSchema = z.object({
  marketPrice: z.number().default(100),
  conditionFactor: z.number().default(1),
  rarityMultiplier: z.number().default(1),
  gradingCost: z.number().default(20),
  sellingFeePercent: z.number().default(10),
  shippingCost: z.number().default(5),
  acquisitionCost: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pokemon_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketPrice * input.conditionFactor * input.rarityMultiplier; results["estimatedSellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedSellingPrice"] = 0; }
  try { const v = input.acquisitionCost + input.gradingCost + ((asFormulaNumber(results["estimatedSellingPrice"])) * input.sellingFeePercent / 100) + input.shippingCost; results["totalCosts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCosts"] = 0; }
  try { const v = (asFormulaNumber(results["estimatedSellingPrice"])) - (asFormulaNumber(results["totalCosts"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePokemon_card_calculator(input: Pokemon_card_calculatorInput): Pokemon_card_calculatorOutput {
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


export interface Pokemon_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

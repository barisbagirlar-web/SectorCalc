// Auto-generated from trading-card-calculator-schema.json
import * as z from 'zod';

export interface Trading_card_calculatorInput {
  cardPrice: number;
  gradingCost: number;
  gradeMultiplier: number;
  shippingCost: number;
  sellingFee: number;
  dataConfidence?: number;
}

export const Trading_card_calculatorInputSchema = z.object({
  cardPrice: z.number().default(100),
  gradingCost: z.number().default(20),
  gradeMultiplier: z.number().default(2.5),
  shippingCost: z.number().default(10),
  sellingFee: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trading_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gradingCost + input.shippingCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.cardPrice * input.gradeMultiplier; results["gradedValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gradedValue"] = 0; }
  try { const v = (asFormulaNumber(results["gradedValue"])) * input.sellingFee / 100; results["feeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["feeAmount"] = 0; }
  try { const v = (asFormulaNumber(results["gradedValue"])) - (asFormulaNumber(results["totalCost"])) - (asFormulaNumber(results["feeAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["netProfit"])) / (asFormulaNumber(results["totalCost"]))) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTrading_card_calculator(input: Trading_card_calculatorInput): Trading_card_calculatorOutput {
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


export interface Trading_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

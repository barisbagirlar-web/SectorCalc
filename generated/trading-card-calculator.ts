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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trading_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gradingCost + input.shippingCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.cardPrice * input.gradeMultiplier; results["gradedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gradedValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gradedValue"])) * input.sellingFee / 100; results["feeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feeAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gradedValue"])) - (toNumericFormulaValue(results["totalCost"])) - (toNumericFormulaValue(results["feeAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netProfit"])) / (toNumericFormulaValue(results["totalCost"]))) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roi"] = Number.NaN; }
  return results;
}


export function calculateTrading_card_calculator(input: Trading_card_calculatorInput): Trading_card_calculatorOutput {
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


export interface Trading_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

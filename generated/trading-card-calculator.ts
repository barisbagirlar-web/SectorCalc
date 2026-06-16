// Auto-generated from trading-card-calculator-schema.json
import * as z from 'zod';

export interface Trading_card_calculatorInput {
  cardPrice: number;
  gradingCost: number;
  gradeMultiplier: number;
  shippingCost: number;
  sellingFee: number;
}

export const Trading_card_calculatorInputSchema = z.object({
  cardPrice: z.number().default(100),
  gradingCost: z.number().default(20),
  gradeMultiplier: z.number().default(2.5),
  shippingCost: z.number().default(10),
  sellingFee: z.number().default(10),
});

function evaluateAllFormulas(input: Trading_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gradingCost + input.shippingCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.cardPrice * input.gradeMultiplier; results["gradedValue"] = Number.isFinite(v) ? v : 0; } catch { results["gradedValue"] = 0; }
  try { const v = (results["gradedValue"] ?? 0) * input.sellingFee / 100; results["feeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["feeAmount"] = 0; }
  try { const v = (results["gradedValue"] ?? 0) - (results["totalCost"] ?? 0) - (results["feeAmount"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((results["netProfit"] ?? 0) / (results["totalCost"] ?? 0)) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateTrading_card_calculator(input: Trading_card_calculatorInput): Trading_card_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
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


export interface Trading_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

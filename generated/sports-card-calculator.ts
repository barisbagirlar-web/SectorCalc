// Auto-generated from sports-card-calculator-schema.json
import * as z from 'zod';

export interface Sports_card_calculatorInput {
  purchasePrice: number;
  salePrice: number;
  gradingCost: number;
  shippingCost: number;
  taxRate: number;
}

export const Sports_card_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100),
  salePrice: z.number().default(150),
  gradingCost: z.number().default(20),
  shippingCost: z.number().default(10),
  taxRate: z.number().default(0),
});

function evaluateAllFormulas(input: Sports_card_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.gradingCost + input.shippingCost; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.salePrice; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.salePrice - input.purchasePrice - input.gradingCost - input.shippingCost; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.salePrice * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - (results["taxAmount"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = input.salePrice !== 0 ? ((results["netProfit"] ?? 0) / input.salePrice) * 100 : 0; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  try { const v = (results["totalInvestment"] ?? 0) !== 0 ? ((results["netProfit"] ?? 0) / (results["totalInvestment"] ?? 0)) * 100 : 0; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateSports_card_calculator(input: Sports_card_calculatorInput): Sports_card_calculatorOutput {
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


export interface Sports_card_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

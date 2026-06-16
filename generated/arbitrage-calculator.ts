// Auto-generated from arbitrage-calculator-schema.json
import * as z from 'zod';

export interface Arbitrage_calculatorInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyFee: number;
  sellFee: number;
}

export const Arbitrage_calculatorInputSchema = z.object({
  buyPrice: z.number().default(100),
  sellPrice: z.number().default(105),
  quantity: z.number().default(10),
  buyFee: z.number().default(5),
  sellFee: z.number().default(5),
});

function evaluateAllFormulas(input: Arbitrage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sellPrice - input.buyPrice) * input.quantity; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.buyFee + input.sellFee; results["totalCosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalCosts"] = 0; }
  try { const v = (input.sellPrice - input.buyPrice) * input.quantity - input.buyFee - input.sellFee; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (input.buyFee + input.sellFee) / (input.sellPrice - input.buyPrice); results["breakEvenVolume"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenVolume"] = 0; }
  return results;
}


export function calculateArbitrage_calculator(input: Arbitrage_calculatorInput): Arbitrage_calculatorOutput {
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


export interface Arbitrage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

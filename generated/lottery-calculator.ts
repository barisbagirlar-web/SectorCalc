// Auto-generated from lottery-calculator-schema.json
import * as z from 'zod';

export interface Lottery_calculatorInput {
  totalTickets: number;
  ticketsPurchased: number;
  ticketCost: number;
  prizeAmount: number;
  numberOfPrizes: number;
}

export const Lottery_calculatorInputSchema = z.object({
  totalTickets: z.number().default(14000000),
  ticketsPurchased: z.number().default(1),
  ticketCost: z.number().default(2),
  prizeAmount: z.number().default(10000000),
  numberOfPrizes: z.number().default(1),
});

function evaluateAllFormulas(input: Lottery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ticketsPurchased / input.totalTickets; results["winProbability"] = Number.isFinite(v) ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = input.ticketsPurchased * input.ticketCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.prizeAmount * input.numberOfPrizes * input.ticketsPurchased) / input.totalTickets; results["expectedReturn"] = Number.isFinite(v) ? v : 0; } catch { results["expectedReturn"] = 0; }
  try { const v = (results["expectedReturn"] ?? 0) - (results["totalCost"] ?? 0); results["netExpected"] = Number.isFinite(v) ? v : 0; } catch { results["netExpected"] = 0; }
  return results;
}


export function calculateLottery_calculator(input: Lottery_calculatorInput): Lottery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netExpected"] ?? 0;
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


export interface Lottery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

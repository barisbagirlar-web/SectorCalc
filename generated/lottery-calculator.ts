// Auto-generated from lottery-calculator-schema.json
import * as z from 'zod';

export interface Lottery_calculatorInput {
  totalTickets: number;
  ticketsPurchased: number;
  ticketCost: number;
  prizeAmount: number;
  numberOfPrizes: number;
  dataConfidence?: number;
}

export const Lottery_calculatorInputSchema = z.object({
  totalTickets: z.number().default(14000000),
  ticketsPurchased: z.number().default(1),
  ticketCost: z.number().default(2),
  prizeAmount: z.number().default(10000000),
  numberOfPrizes: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lottery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ticketsPurchased / input.totalTickets; results["winProbability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = input.ticketsPurchased * input.ticketCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.prizeAmount * input.numberOfPrizes * input.ticketsPurchased) / input.totalTickets; results["expectedReturn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedReturn"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLottery_calculator(input: Lottery_calculatorInput): Lottery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedReturn"]);
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


export interface Lottery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

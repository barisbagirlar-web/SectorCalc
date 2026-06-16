// Auto-generated from coin-flip-calculator-schema.json
import * as z from 'zod';

export interface Coin_flip_calculatorInput {
  numberOfFlips: number;
  numberOfHeads: number;
  probabilityOfHead: number;
  decimalPlaces: number;
}

export const Coin_flip_calculatorInputSchema = z.object({
  numberOfFlips: z.number().default(10),
  numberOfHeads: z.number().default(5),
  probabilityOfHead: z.number().default(0.5),
  decimalPlaces: z.number().default(4),
});

function evaluateAllFormulas(input: Coin_flip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(n,k,p,d){ function fact(x){ return x<2?1:x*fact(x-1); } var prob = fact(n)/(fact(k)*fact(n-k)) * Math.pow(p,k) * Math.pow(1-p,n-k); return Math.round(prob * Math.pow(10,d)) / Math.pow(10,d); })(numberOfFlips, numberOfHeads, probabilityOfHead, decimalPlaces); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  try { const v = Math.round(input.numberOfFlips * input.probabilityOfHead * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["expectedHeads"] = Number.isFinite(v) ? v : 0; } catch { results["expectedHeads"] = 0; }
  try { const v = Math.round(Math.sqrt(input.numberOfFlips * input.probabilityOfHead * (1 - input.probabilityOfHead)) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["standardDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["standardDeviation"] = 0; }
  return results;
}


export function calculateCoin_flip_calculator(input: Coin_flip_calculatorInput): Coin_flip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Coin_flip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

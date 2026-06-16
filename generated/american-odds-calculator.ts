// Auto-generated from american-odds-calculator-schema.json
import * as z from 'zod';

export interface American_odds_calculatorInput {
  mode: number;
  americanOdds: number;
  wager: number;
  desiredProfit: number;
}

export const American_odds_calculatorInputSchema = z.object({
  mode: z.number().default(0),
  americanOdds: z.number().default(-110),
  wager: z.number().default(100),
  desiredProfit: z.number().default(100),
});

function evaluateAllFormulas(input: American_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.americanOdds > 0 ? input.wager * input.americanOdds / 100 : input.wager * 100 / Math.abs(input.americanOdds); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = input.wager + (results["profit"] ?? 0); results["payout"] = Number.isFinite(v) ? v : 0; } catch { results["payout"] = 0; }
  try { const v = input.americanOdds > 0 ? 100 / (input.americanOdds + 100) : Math.abs(input.americanOdds) / (Math.abs(input.americanOdds) + 100); results["impliedProbability"] = Number.isFinite(v) ? v : 0; } catch { results["impliedProbability"] = 0; }
  try { const v = input.americanOdds > 0 ? input.desiredProfit * 100 / input.americanOdds : input.desiredProfit * Math.abs(input.americanOdds) / 100; results["requiredWager"] = Number.isFinite(v) ? v : 0; } catch { results["requiredWager"] = 0; }
  try { const v = input.mode === 0 ? (results["profit"] ?? 0) : (results["requiredWager"] ?? 0); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateAmerican_odds_calculator(input: American_odds_calculatorInput): American_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface American_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

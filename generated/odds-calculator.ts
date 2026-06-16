// Auto-generated from odds-calculator-schema.json
import * as z from 'zod';

export interface Odds_calculatorInput {
  homeProb: number;
  drawProb: number;
  awayProb: number;
  margin: number;
}

export const Odds_calculatorInputSchema = z.object({
  homeProb: z.number().default(40),
  drawProb: z.number().default(30),
  awayProb: z.number().default(30),
  margin: z.number().default(5),
});

function evaluateAllFormulas(input: Odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.homeProb > 0 ? 100 / input.homeProb : 0; results["fairHomeDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["fairHomeDecimal"] = 0; }
  try { const v = input.drawProb > 0 ? 100 / input.drawProb : 0; results["fairDrawDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["fairDrawDecimal"] = 0; }
  try { const v = input.awayProb > 0 ? 100 / input.awayProb : 0; results["fairAwayDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["fairAwayDecimal"] = 0; }
  try { const v = 1 + input.margin / 100; results["marginFactor"] = Number.isFinite(v) ? v : 0; } catch { results["marginFactor"] = 0; }
  try { const v = (results["fairHomeDecimal"] ?? 0) / (results["marginFactor"] ?? 0); results["homeOdds"] = Number.isFinite(v) ? v : 0; } catch { results["homeOdds"] = 0; }
  try { const v = (results["fairDrawDecimal"] ?? 0) / (results["marginFactor"] ?? 0); results["drawOdds"] = Number.isFinite(v) ? v : 0; } catch { results["drawOdds"] = 0; }
  try { const v = (results["fairAwayDecimal"] ?? 0) / (results["marginFactor"] ?? 0); results["awayOdds"] = Number.isFinite(v) ? v : 0; } catch { results["awayOdds"] = 0; }
  try { const v = (results["homeOdds"] ?? 0) > 0 ? 100 / (results["homeOdds"] ?? 0) : 0; results["impliedHomeProb"] = Number.isFinite(v) ? v : 0; } catch { results["impliedHomeProb"] = 0; }
  try { const v = (results["drawOdds"] ?? 0) > 0 ? 100 / (results["drawOdds"] ?? 0) : 0; results["impliedDrawProb"] = Number.isFinite(v) ? v : 0; } catch { results["impliedDrawProb"] = 0; }
  try { const v = (results["awayOdds"] ?? 0) > 0 ? 100 / (results["awayOdds"] ?? 0) : 0; results["impliedAwayProb"] = Number.isFinite(v) ? v : 0; } catch { results["impliedAwayProb"] = 0; }
  try { const v = ((results["impliedHomeProb"] ?? 0) + (results["impliedDrawProb"] ?? 0) + (results["impliedAwayProb"] ?? 0)) - 100; results["overround"] = Number.isFinite(v) ? v : 0; } catch { results["overround"] = 0; }
  return results;
}


export function calculateOdds_calculator(input: Odds_calculatorInput): Odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overround"] ?? 0;
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


export interface Odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

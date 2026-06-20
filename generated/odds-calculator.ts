// Auto-generated from odds-calculator-schema.json
import * as z from 'zod';

export interface Odds_calculatorInput {
  homeProb: number;
  drawProb: number;
  awayProb: number;
  margin: number;
  dataConfidence?: number;
}

export const Odds_calculatorInputSchema = z.object({
  homeProb: z.number().default(40),
  drawProb: z.number().default(30),
  awayProb: z.number().default(30),
  margin: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.homeProb > 0 ? 100 / input.homeProb : 0; results["fairHomeDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fairHomeDecimal"] = Number.NaN; }
  try { const v = input.drawProb > 0 ? 100 / input.drawProb : 0; results["fairDrawDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fairDrawDecimal"] = Number.NaN; }
  try { const v = input.awayProb > 0 ? 100 / input.awayProb : 0; results["fairAwayDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fairAwayDecimal"] = Number.NaN; }
  try { const v = 1 + input.margin / 100; results["marginFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fairHomeDecimal"])) / (toNumericFormulaValue(results["marginFactor"])); results["homeOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["homeOdds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fairDrawDecimal"])) / (toNumericFormulaValue(results["marginFactor"])); results["drawOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drawOdds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fairAwayDecimal"])) / (toNumericFormulaValue(results["marginFactor"])); results["awayOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["awayOdds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["homeOdds"])) > 0 ? 100 / (toNumericFormulaValue(results["homeOdds"])) : 0; results["impliedHomeProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["impliedHomeProb"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["drawOdds"])) > 0 ? 100 / (toNumericFormulaValue(results["drawOdds"])) : 0; results["impliedDrawProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["impliedDrawProb"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["awayOdds"])) > 0 ? 100 / (toNumericFormulaValue(results["awayOdds"])) : 0; results["impliedAwayProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["impliedAwayProb"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["impliedHomeProb"])) + (toNumericFormulaValue(results["impliedDrawProb"])) + (toNumericFormulaValue(results["impliedAwayProb"]))) - 100; results["overround"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overround"] = Number.NaN; }
  return results;
}


export function calculateOdds_calculator(input: Odds_calculatorInput): Odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overround"]);
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


export interface Odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

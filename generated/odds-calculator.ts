// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Odds_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.homeProb > 0 ? 100 / input.homeProb : 0; results["fairHomeDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fairHomeDecimal"] = 0; }
  try { const v = input.drawProb > 0 ? 100 / input.drawProb : 0; results["fairDrawDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fairDrawDecimal"] = 0; }
  try { const v = input.awayProb > 0 ? 100 / input.awayProb : 0; results["fairAwayDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fairAwayDecimal"] = 0; }
  try { const v = 1 + input.margin / 100; results["marginFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marginFactor"] = 0; }
  try { const v = (asFormulaNumber(results["fairHomeDecimal"])) / (asFormulaNumber(results["marginFactor"])); results["homeOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["homeOdds"] = 0; }
  try { const v = (asFormulaNumber(results["fairDrawDecimal"])) / (asFormulaNumber(results["marginFactor"])); results["drawOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["drawOdds"] = 0; }
  try { const v = (asFormulaNumber(results["fairAwayDecimal"])) / (asFormulaNumber(results["marginFactor"])); results["awayOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["awayOdds"] = 0; }
  try { const v = (asFormulaNumber(results["homeOdds"])) > 0 ? 100 / (asFormulaNumber(results["homeOdds"])) : 0; results["impliedHomeProb"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["impliedHomeProb"] = 0; }
  try { const v = (asFormulaNumber(results["drawOdds"])) > 0 ? 100 / (asFormulaNumber(results["drawOdds"])) : 0; results["impliedDrawProb"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["impliedDrawProb"] = 0; }
  try { const v = (asFormulaNumber(results["awayOdds"])) > 0 ? 100 / (asFormulaNumber(results["awayOdds"])) : 0; results["impliedAwayProb"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["impliedAwayProb"] = 0; }
  try { const v = ((asFormulaNumber(results["impliedHomeProb"])) + (asFormulaNumber(results["impliedDrawProb"])) + (asFormulaNumber(results["impliedAwayProb"]))) - 100; results["overround"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overround"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOdds_calculator(input: Odds_calculatorInput): Odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overround"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

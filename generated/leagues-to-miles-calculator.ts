// @ts-nocheck
// Auto-generated from leagues-to-miles-calculator-schema.json
import * as z from 'zod';

export interface Leagues_to_miles_calculatorInput {
  leagues: number;
  leagueType: number;
  decimals: number;
  conversionFactorOverride: number;
}

export const Leagues_to_miles_calculatorInputSchema = z.object({
  leagues: z.number().default(1),
  leagueType: z.number().default(0),
  decimals: z.number().default(2),
  conversionFactorOverride: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Leagues_to_miles_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.leagues * input.leagueType * input.decimals * input.conversionFactorOverride; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.leagues * input.leagueType * input.decimals * input.conversionFactorOverride; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLeagues_to_miles_calculator(input: Leagues_to_miles_calculatorInput): Leagues_to_miles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Leagues_to_miles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

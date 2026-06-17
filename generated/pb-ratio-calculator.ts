// @ts-nocheck
// Auto-generated from pb-ratio-calculator-schema.json
import * as z from 'zod';

export interface Pb_ratio_calculatorInput {
  marketPricePerShare: number;
  totalEquity: number;
  sharesOutstanding: number;
  industryPB: number;
}

export const Pb_ratio_calculatorInputSchema = z.object({
  marketPricePerShare: z.number().default(50),
  totalEquity: z.number().default(1000000),
  sharesOutstanding: z.number().default(10000),
  industryPB: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pb_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalEquity / input.sharesOutstanding; results["bookValuePerShare"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bookValuePerShare"] = 0; }
  try { const v = input.marketPricePerShare / (asFormulaNumber(results["bookValuePerShare"])); results["pbRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pbRatio"] = 0; }
  try { const v = (asFormulaNumber(results["pbRatio"])) - input.industryPB; results["pbVsIndustry"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pbVsIndustry"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePb_ratio_calculator(input: Pb_ratio_calculatorInput): Pb_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pbRatio"]);
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


export interface Pb_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

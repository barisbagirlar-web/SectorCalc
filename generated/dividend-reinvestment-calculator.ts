// @ts-nocheck
// Auto-generated from dividend-reinvestment-calculator-schema.json
import * as z from 'zod';

export interface Dividend_reinvestment_calculatorInput {
  initialInvestment: number;
  annualDividendYield: number;
  dividendGrowthRate: number;
  stockPriceGrowthRate: number;
  years: number;
  taxRate: number;
}

export const Dividend_reinvestment_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  annualDividendYield: z.number().default(4),
  dividendGrowthRate: z.number().default(5),
  stockPriceGrowthRate: z.number().default(7),
  years: z.number().default(10),
  taxRate: z.number().default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dividend_reinvestment_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.initialInvestment * (1 + input.stockPriceGrowthRate/100)**input.years + (input.initialInvestment * input.annualDividendYield/100 * (1 - input.taxRate/100) * ((1 + input.dividendGrowthRate/100)**input.years - 1) / (input.dividendGrowthRate/100)); results["totalValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalValue"] = 0; }
  try { const v = input.initialInvestment * input.annualDividendYield/100 * (1 - input.taxRate/100) * ((1 + input.dividendGrowthRate/100)**input.years - 1) / (input.dividendGrowthRate/100); results["totalDividends"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDividends"] = 0; }
  try { const v = input.initialInvestment * ((1 + input.stockPriceGrowthRate/100)**input.years - 1); results["capitalGains"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capitalGains"] = 0; }
  try { const v = (((asFormulaNumber(results["totalValue"])) / input.initialInvestment)**(1/input.years) - 1) * 100; results["effectiveYield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveYield"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDividend_reinvestment_calculator(input: Dividend_reinvestment_calculatorInput): Dividend_reinvestment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalValue"]);
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


export interface Dividend_reinvestment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

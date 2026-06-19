// Auto-generated from ebitda-calculator-schema.json
import * as z from 'zod';

export interface Ebitda_calculatorInput {
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  amortization: number;
  dataConfidence?: number;
}

export const Ebitda_calculatorInputSchema = z.object({
  revenue: z.number().default(0),
  cogs: z.number().default(0),
  opex: z.number().default(0),
  depreciation: z.number().default(0),
  amortization: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ebitda_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs - input.opex; results["ebitda"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ebitda"] = 0; }
  try { const v = input.revenue - input.cogs; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.revenue - input.cogs - input.opex - input.depreciation - input.amortization; results["ebit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEbitda_calculator(input: Ebitda_calculatorInput): Ebitda_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ebitda"]);
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


export interface Ebitda_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

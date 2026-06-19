// Auto-generated from ev-ebitda-calculator-schema.json
import * as z from 'zod';

export interface Ev_ebitda_calculatorInput {
  market_cap: number;
  total_debt: number;
  minority_interest: number;
  preferred_stock: number;
  cash_equivalents: number;
  ebitda: number;
  dataConfidence?: number;
}

export const Ev_ebitda_calculatorInputSchema = z.object({
  market_cap: z.number().default(0),
  total_debt: z.number().default(0),
  minority_interest: z.number().default(0),
  preferred_stock: z.number().default(0),
  cash_equivalents: z.number().default(0),
  ebitda: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ev_ebitda_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.market_cap + input.total_debt + input.minority_interest + input.preferred_stock - input.cash_equivalents; results["enterprise_value"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["enterprise_value"] = 0; }
  try { const v = (asFormulaNumber(results["enterprise_value"])) / input.ebitda; results["ev_ebitda_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ev_ebitda_ratio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEv_ebitda_calculator(input: Ev_ebitda_calculatorInput): Ev_ebitda_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ev_ebitda_ratio"]);
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


export interface Ev_ebitda_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

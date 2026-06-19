// Auto-generated from series-i-savings-bond-calculator-schema.json
import * as z from 'zod';

export interface Series_i_savings_bond_calculatorInput {
  principal: number;
  fixedRate: number;
  inflationRate: number;
  years: number;
  dataConfidence?: number;
}

export const Series_i_savings_bond_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  fixedRate: z.number().default(0),
  inflationRate: z.number().default(1.5),
  years: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Series_i_savings_bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fixedRate/100 + 2*(input.inflationRate/100) + (input.fixedRate/100)*(input.inflationRate/100); results["compositeRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["compositeRate"] = 0; }
  try { const v = input.fixedRate/100 + 2*(input.inflationRate/100) + (input.fixedRate/100)*(input.inflationRate/100); results["compositeRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["compositeRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSeries_i_savings_bond_calculator(input: Series_i_savings_bond_calculatorInput): Series_i_savings_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["compositeRate_aux"]);
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


export interface Series_i_savings_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from abc-analysis-calculator-schema.json
import * as z from 'zod';

export interface Abc_analysis_calculatorInput {
  annualDemand: number;
  unitCost: number;
  totalUsageValue: number;
  aClassThreshold: number;
  bClassThreshold: number;
  dataConfidence?: number;
}

export const Abc_analysis_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1200),
  unitCost: z.number().default(25),
  totalUsageValue: z.number().default(100000),
  aClassThreshold: z.number().default(70),
  bClassThreshold: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Abc_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand * input.unitCost; results["itemUsageValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["itemUsageValue"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["itemUsageValue"])) / input.totalUsageValue) * 100; results["percentageOfTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentageOfTotal"] = Number.NaN; }
  return results;
}


export function calculateAbc_analysis_calculator(input: Abc_analysis_calculatorInput): Abc_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["itemUsageValue"]);
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


export interface Abc_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from cpa-calculator-schema.json
import * as z from 'zod';

export interface Cpa_calculatorInput {
  marketingCost: number;
  salesCost: number;
  overheadCost: number;
  otherCost: number;
  acquiredCustomers: number;
  dataConfidence?: number;
}

export const Cpa_calculatorInputSchema = z.object({
  marketingCost: z.number().default(10000),
  salesCost: z.number().default(5000),
  overheadCost: z.number().default(2000),
  otherCost: z.number().default(0),
  acquiredCustomers: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketingCost + input.salesCost + input.overheadCost + input.otherCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.acquiredCustomers === 0 ? 0 : ((toNumericFormulaValue(results["totalCost"])) / input.acquiredCustomers); results["cpa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cpa"] = Number.NaN; }
  return results;
}


export function calculateCpa_calculator(input: Cpa_calculatorInput): Cpa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cpa"]);
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


export interface Cpa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

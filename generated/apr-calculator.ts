// Auto-generated from apr-calculator-schema.json
import * as z from 'zod';

export interface Apr_calculatorInput {
  loanAmount: number;
  nominalRate: number;
  loanTermYears: number;
  compoundingFrequency: number;
  fees: number;
  dataConfidence?: number;
}

export const Apr_calculatorInputSchema = z.object({
  loanAmount: z.number().default(10000),
  nominalRate: z.number().default(5),
  loanTermYears: z.number().default(5),
  compoundingFrequency: z.number().default(12),
  fees: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Apr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanTermYears * input.loanAmount; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.loanTermYears * input.loanAmount * (1 + (input.nominalRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.loanTermYears * input.loanAmount * (1 + (input.nominalRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateApr_calculator(input: Apr_calculatorInput): Apr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Apr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

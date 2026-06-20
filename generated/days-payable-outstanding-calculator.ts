// Auto-generated from days-payable-outstanding-calculator-schema.json
import * as z from 'zod';

export interface Days_payable_outstanding_calculatorInput {
  apBegin: number;
  apEnd: number;
  cogs: number;
  days: number;
  dataConfidence?: number;
}

export const Days_payable_outstanding_calculatorInputSchema = z.object({
  apBegin: z.number().default(80000),
  apEnd: z.number().default(100000),
  cogs: z.number().default(500000),
  days: z.number().default(365),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Days_payable_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.apBegin + input.apEnd) / 2; results["averageAP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageAP"] = Number.NaN; }
  try { const v = ((input.apBegin + input.apEnd) / 2) / input.cogs * input.days; results["dpo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dpo"] = Number.NaN; }
  try { const v = input.cogs / ((input.apBegin + input.apEnd) / 2); results["apTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["apTurnover"] = Number.NaN; }
  return results;
}


export function calculateDays_payable_outstanding_calculator(input: Days_payable_outstanding_calculatorInput): Days_payable_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dpo"]);
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


export interface Days_payable_outstanding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Days_payable_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.apBegin + input.apEnd) / 2; results["averageAP"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageAP"] = 0; }
  try { const v = ((input.apBegin + input.apEnd) / 2) / input.cogs * input.days; results["dpo"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dpo"] = 0; }
  try { const v = input.cogs / ((input.apBegin + input.apEnd) / 2); results["apTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apTurnover"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDays_payable_outstanding_calculator(input: Days_payable_outstanding_calculatorInput): Days_payable_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dpo"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

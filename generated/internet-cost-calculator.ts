// Auto-generated from internet-cost-calculator-schema.json
import * as z from 'zod';

export interface Internet_cost_calculatorInput {
  monthlyBaseFee: number;
  dataCap: number;
  overageRate: number;
  usage: number;
  discountPercent: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Internet_cost_calculatorInputSchema = z.object({
  monthlyBaseFee: z.number().default(50),
  dataCap: z.number().default(100),
  overageRate: z.number().default(2),
  usage: z.number().default(120),
  discountPercent: z.number().default(10),
  taxRate: z.number().default(18),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Internet_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.monthlyBaseFee) * (input.dataCap) * (input.overageRate) * (input.usage) * (input.discountPercent) * (input.taxRate); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (input.monthlyBaseFee) * (input.dataCap) * (input.overageRate); results["discountAmount_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount_aux"] = Number.NaN; }
  return results;
}


export function calculateInternet_cost_calculator(input: Internet_cost_calculatorInput): Internet_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["discountAmount_aux"]);
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


export interface Internet_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

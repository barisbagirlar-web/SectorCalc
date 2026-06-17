// @ts-nocheck
// Auto-generated from ach-fee-calculator-schema.json
import * as z from 'zod';

export interface Ach_fee_calculatorInput {
  transactionsPerMonth: number;
  flatFeePerTransaction: number;
  percentageFeeRate: number;
  totalMonthlyVolume: number;
  monthlyBaseFee: number;
}

export const Ach_fee_calculatorInputSchema = z.object({
  transactionsPerMonth: z.number().default(100),
  flatFeePerTransaction: z.number().default(0.5),
  percentageFeeRate: z.number().default(0.1),
  totalMonthlyVolume: z.number().default(50000),
  monthlyBaseFee: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ach_fee_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.transactionsPerMonth * input.flatFeePerTransaction; results["flatFeeTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flatFeeTotal"] = 0; }
  try { const v = input.totalMonthlyVolume * input.percentageFeeRate / 100; results["volumeFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeFee"] = 0; }
  try { const v = input.monthlyBaseFee + input.transactionsPerMonth * input.flatFeePerTransaction + input.totalMonthlyVolume * input.percentageFeeRate / 100; results["totalFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAch_fee_calculator(input: Ach_fee_calculatorInput): Ach_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["flatFeeTotal"]);
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


export interface Ach_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

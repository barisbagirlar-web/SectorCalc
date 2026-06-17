// @ts-nocheck
// Auto-generated from recomp-calculator-schema.json
import * as z from 'zod';

export interface Recomp_calculatorInput {
  baseAmount: number;
  rate: number;
  time: number;
  expenses: number;
  adjustmentFactor: number;
}

export const Recomp_calculatorInputSchema = z.object({
  baseAmount: z.number().default(1000),
  rate: z.number().default(5),
  time: z.number().default(12),
  expenses: z.number().default(0),
  adjustmentFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recomp_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.baseAmount * (input.rate / 100) * (input.time / 12); results["interestAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interestAmount"] = 0; }
  try { const v = input.baseAmount + (asFormulaNumber(results["interestAmount"])) + input.expenses; results["totalBeforeAdjustment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBeforeAdjustment"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeAdjustment"])) * input.adjustmentFactor; results["totalCompensation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCompensation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRecomp_calculator(input: Recomp_calculatorInput): Recomp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCompensation"]);
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


export interface Recomp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

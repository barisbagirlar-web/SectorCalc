// @ts-nocheck
// Auto-generated from annuity-calculator-schema.json
import * as z from 'zod';

export interface Annuity_calculatorInput {
  payment: number;
  annualRate: number;
  years: number;
  compounding: number;
}

export const Annuity_calculatorInputSchema = z.object({
  payment: z.number().default(1000),
  annualRate: z.number().default(5),
  years: z.number().default(10),
  compounding: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Annuity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.payment * ((1 - (1 + (input.annualRate/100/input.compounding)) ** -(input.years*input.compounding)) / (input.annualRate/100/input.compounding)); results["presentValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["presentValue"] = 0; }
  try { const v = input.payment * (((1 + (input.annualRate/100/input.compounding)) ** (input.years*input.compounding) - 1) / (input.annualRate/100/input.compounding)); results["futureValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.payment * input.years * input.compounding; results["totalPayments"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayments"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAnnuity_calculator(input: Annuity_calculatorInput): Annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["presentValue"]);
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


export interface Annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

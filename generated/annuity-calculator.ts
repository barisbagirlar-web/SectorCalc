// Auto-generated from annuity-calculator-schema.json
import * as z from 'zod';

export interface Annuity_calculatorInput {
  payment: number;
  annualRate: number;
  years: number;
  compounding: number;
  dataConfidence?: number;
}

export const Annuity_calculatorInputSchema = z.object({
  payment: z.number().default(1000),
  annualRate: z.number().default(5),
  years: z.number().default(10),
  compounding: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Annuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.payment * ((1 - (1 + (input.annualRate/100/input.compounding)) ** -(input.years*input.compounding)) / (input.annualRate/100/input.compounding)); results["presentValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["presentValue"] = Number.NaN; }
  try { const v = input.payment * (((1 + (input.annualRate/100/input.compounding)) ** (input.years*input.compounding) - 1) / (input.annualRate/100/input.compounding)); results["futureValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["futureValue"] = Number.NaN; }
  try { const v = input.payment * input.years * input.compounding; results["totalPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayments"] = Number.NaN; }
  return results;
}


export function calculateAnnuity_calculator(input: Annuity_calculatorInput): Annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["presentValue"]);
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


export interface Annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

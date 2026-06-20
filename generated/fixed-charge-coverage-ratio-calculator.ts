// Auto-generated from fixed-charge-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Fixed_charge_coverage_ratio_calculatorInput {
  ebitda: number;
  interestExpense: number;
  currentMaturities: number;
  leasePayments: number;
  dataConfidence?: number;
}

export const Fixed_charge_coverage_ratio_calculatorInputSchema = z.object({
  ebitda: z.number().default(0),
  interestExpense: z.number().default(0),
  currentMaturities: z.number().default(0),
  leasePayments: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fixed_charge_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestExpense + input.currentMaturities + input.leasePayments; results["totalFixedCharges"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFixedCharges"] = Number.NaN; }
  try { const v = input.ebitda; results["ebitdaOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ebitdaOut"] = Number.NaN; }
  try { const v = input.ebitda / (input.interestExpense + input.currentMaturities + input.leasePayments); results["fccr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fccr"] = Number.NaN; }
  return results;
}


export function calculateFixed_charge_coverage_ratio_calculator(input: Fixed_charge_coverage_ratio_calculatorInput): Fixed_charge_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fccr"]);
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


export interface Fixed_charge_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

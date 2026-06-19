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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fixed_charge_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestExpense + input.currentMaturities + input.leasePayments; results["totalFixedCharges"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFixedCharges"] = 0; }
  try { const v = input.ebitda; results["ebitdaOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ebitdaOut"] = 0; }
  try { const v = input.ebitda / (input.interestExpense + input.currentMaturities + input.leasePayments); results["fccr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fccr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFixed_charge_coverage_ratio_calculator(input: Fixed_charge_coverage_ratio_calculatorInput): Fixed_charge_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fccr"]));
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


export interface Fixed_charge_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

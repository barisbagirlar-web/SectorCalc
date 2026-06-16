// Auto-generated from fixed-charge-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Fixed_charge_coverage_ratio_calculatorInput {
  ebitda: number;
  interestExpense: number;
  currentMaturities: number;
  leasePayments: number;
}

export const Fixed_charge_coverage_ratio_calculatorInputSchema = z.object({
  ebitda: z.number().default(0),
  interestExpense: z.number().default(0),
  currentMaturities: z.number().default(0),
  leasePayments: z.number().default(0),
});

function evaluateAllFormulas(input: Fixed_charge_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestExpense + input.currentMaturities + input.leasePayments; results["totalFixedCharges"] = Number.isFinite(v) ? v : 0; } catch { results["totalFixedCharges"] = 0; }
  try { const v = input.ebitda; results["ebitdaOut"] = Number.isFinite(v) ? v : 0; } catch { results["ebitdaOut"] = 0; }
  try { const v = input.ebitda / (input.interestExpense + input.currentMaturities + input.leasePayments); results["fccr"] = Number.isFinite(v) ? v : 0; } catch { results["fccr"] = 0; }
  return results;
}


export function calculateFixed_charge_coverage_ratio_calculator(input: Fixed_charge_coverage_ratio_calculatorInput): Fixed_charge_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fccr"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

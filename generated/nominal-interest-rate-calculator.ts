// Auto-generated from nominal-interest-rate-calculator-schema.json
import * as z from 'zod';

export interface Nominal_interest_rate_calculatorInput {
  realRate: number;
  inflationRate: number;
  taxRate: number;
  feePercentage: number;
}

export const Nominal_interest_rate_calculatorInputSchema = z.object({
  realRate: z.number().default(2),
  inflationRate: z.number().default(3),
  taxRate: z.number().default(25),
  feePercentage: z.number().default(0.5),
});

function evaluateAllFormulas(input: Nominal_interest_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.realRate / 100; results["realDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["realDecimal"] = 0; }
  try { const v = input.inflationRate / 100; results["inflDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["inflDecimal"] = 0; }
  try { const v = input.taxRate / 100; results["taxDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["taxDecimal"] = 0; }
  try { const v = input.feePercentage / 100; results["feeDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["feeDecimal"] = 0; }
  try { const v = (1 + (results["realDecimal"] ?? 0)) * (1 + (results["inflDecimal"] ?? 0)) - 1; results["nominalDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["nominalDecimal"] = 0; }
  try { const v = (results["nominalDecimal"] ?? 0) * 100; results["nominalRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["nominalRatePercent"] = 0; }
  try { const v = (results["nominalDecimal"] ?? 0) * (1 - (results["taxDecimal"] ?? 0)); results["afterTaxDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxDecimal"] = 0; }
  try { const v = (results["afterTaxDecimal"] ?? 0) * 100; results["afterTaxRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxRatePercent"] = 0; }
  try { const v = (results["afterTaxDecimal"] ?? 0) - (results["feeDecimal"] ?? 0); results["afterFeesDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["afterFeesDecimal"] = 0; }
  try { const v = (results["afterFeesDecimal"] ?? 0) * 100; results["afterFeesRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["afterFeesRatePercent"] = 0; }
  return results;
}


export function calculateNominal_interest_rate_calculator(input: Nominal_interest_rate_calculatorInput): Nominal_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Nominal"] ?? 0;
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


export interface Nominal_interest_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

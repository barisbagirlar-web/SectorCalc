// Auto-generated from i-bond-calculator-schema.json
import * as z from 'zod';

export interface I_bond_calculatorInput {
  principal: number;
  fixedRate: number;
  inflationRate: number;
  years: number;
}

export const I_bond_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  fixedRate: z.number().default(0.4),
  inflationRate: z.number().default(3.24),
  years: z.number().default(5),
});

function evaluateAllFormulas(input: I_bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fixedRate/100) + 2*(input.inflationRate/100) + (input.fixedRate/100)*(input.inflationRate/100); results["compositeRateDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["compositeRateDecimal"] = 0; }
  try { const v = input.principal * Math.pow(1 + (results["compositeRateDecimal"] ?? 0)/2, 2*input.years); results["finalValue"] = Number.isFinite(v) ? v : 0; } catch { results["finalValue"] = 0; }
  try { const v = (results["finalValue"] ?? 0) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (results["compositeRateDecimal"] ?? 0) * 100; results["compositeRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["compositeRatePercent"] = 0; }
  try { const v = (Math.pow(1 + (results["compositeRateDecimal"] ?? 0)/2, 2) - 1) * 100; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


export function calculateI_bond_calculator(input: I_bond_calculatorInput): I_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalValue"] ?? 0;
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


export interface I_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

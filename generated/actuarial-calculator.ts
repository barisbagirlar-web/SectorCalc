// Auto-generated from actuarial-calculator-schema.json
import * as z from 'zod';

export interface Actuarial_calculatorInput {
  sumAssured: number;
  mortalityRate: number;
  interestRate: number;
  term: number;
}

export const Actuarial_calculatorInputSchema = z.object({
  sumAssured: z.number().default(100000),
  mortalityRate: z.number().default(0.005),
  interestRate: z.number().default(0.03),
  term: z.number().default(20),
});

function evaluateAllFormulas(input: Actuarial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumAssured * input.mortalityRate * (1/(1+input.interestRate)) * (1 - Math.pow((1-input.mortalityRate)*(1/(1+input.interestRate)), input.term)) / (1 - (1-input.mortalityRate)*(1/(1+input.interestRate))); results["netSinglePremium"] = Number.isFinite(v) ? v : 0; } catch { results["netSinglePremium"] = 0; }
  try { const v = 1/(1+input.interestRate); results["discountFactor"] = Number.isFinite(v) ? v : 0; } catch { results["discountFactor"] = 0; }
  try { const v = input.sumAssured * input.mortalityRate; results["mortalityRiskCost"] = Number.isFinite(v) ? v : 0; } catch { results["mortalityRiskCost"] = 0; }
  try { const v = (1/(1+input.interestRate)) * (1 - Math.pow((1-input.mortalityRate)*(1/(1+input.interestRate)), input.term)) / (1 - (1-input.mortalityRate)*(1/(1+input.interestRate))); results["termAnnuityPresentValueFactor"] = Number.isFinite(v) ? v : 0; } catch { results["termAnnuityPresentValueFactor"] = 0; }
  return results;
}


export function calculateActuarial_calculator(input: Actuarial_calculatorInput): Actuarial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netSinglePremium"] ?? 0;
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


export interface Actuarial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

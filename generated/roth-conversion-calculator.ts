// Auto-generated from roth-conversion-calculator-schema.json
import * as z from 'zod';

export interface Roth_conversion_calculatorInput {
  currentBalance: number;
  amountToConvert: number;
  currentTaxRate: number;
  expectedRetirementTaxRate: number;
  yearsToRetirement: number;
  annualReturnRate: number;
}

export const Roth_conversion_calculatorInputSchema = z.object({
  currentBalance: z.number().default(100000),
  amountToConvert: z.number().default(100000),
  currentTaxRate: z.number().default(24),
  expectedRetirementTaxRate: z.number().default(24),
  yearsToRetirement: z.number().default(20),
  annualReturnRate: z.number().default(7),
});

function evaluateAllFormulas(input: Roth_conversion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.amountToConvert * (1 - input.currentTaxRate / 100) * Math.pow(1 + input.annualReturnRate / 100, input.yearsToRetirement); results["convertAfterTaxValue"] = Number.isFinite(v) ? v : 0; } catch { results["convertAfterTaxValue"] = 0; }
  try { const v = input.amountToConvert * Math.pow(1 + input.annualReturnRate / 100, input.yearsToRetirement) * (1 - input.expectedRetirementTaxRate / 100); results["noConvertAfterTaxValue"] = Number.isFinite(v) ? v : 0; } catch { results["noConvertAfterTaxValue"] = 0; }
  try { const v = (results["convertAfterTaxValue"] ?? 0) - (results["noConvertAfterTaxValue"] ?? 0); results["conversionBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["conversionBenefit"] = 0; }
  return results;
}


export function calculateRoth_conversion_calculator(input: Roth_conversion_calculatorInput): Roth_conversion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertAfterTaxValue"] ?? 0;
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


export interface Roth_conversion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

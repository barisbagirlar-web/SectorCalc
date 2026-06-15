// Auto-generated from fraction-to-decimal-calculator-schema.json
import * as z from 'zod';

export interface Fraction_to_decimal_calculatorInput {
  numerator: number;
  denominator: number;
  wholeNumber: number;
  decimalPlaces: number;
  roundingMethod: string;
  uncertaintyInput: number;
}

export const Fraction_to_decimal_calculatorInputSchema = z.object({
  numerator: z.number().min(-999999).max(999999).default(1),
  denominator: z.number().min(1).max(999999).default(4),
  wholeNumber: z.number().min(-999999).max(999999).default(0),
  decimalPlaces: z.number().min(0).max(15).default(6),
  roundingMethod: z.enum(['half_up', 'half_down', 'half_even', 'floor', 'ceiling', 'truncate']).default('half_up'),
  uncertaintyInput: z.number().min(0).max(999999).default(0),
});

function evaluateAllFormulas(input: Fraction_to_decimal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["fractional_value"] = input.numerator / input.denominator; } catch { results["fractional_value"] = 0; }
  try { results["mixed_value"] = input.wholeNumber + (results["fractional_value"] ?? 0); } catch { results["mixed_value"] = 0; }
  try { results["raw_decimal"] = (results["mixed_value"] ?? 0); } catch { results["raw_decimal"] = 0; }
  try { results["rounded_decimal"] = Math.round((results["raw_decimal"] ?? 0), input.decimalPlaces, input.roundingMethod); } catch { results["rounded_decimal"] = 0; }
  try { results["uncertainty_propagated"] = input.uncertaintyInput / input.denominator; } catch { results["uncertainty_propagated"] = 0; }
  try { results["data_confidence_adjusted"] = (results["rounded_decimal"] ?? 0) - (results["uncertainty_propagated"] ?? 0); } catch { results["data_confidence_adjusted"] = 0; }
  try { results["primary_result"] = (results["data_confidence_adjusted"] ?? 0); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateFraction_to_decimal_calculator(input: Fraction_to_decimal_calculatorInput): Fraction_to_decimal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    fractionalValue: values["fractionalValue"] ?? 0,
    mixedValue: values["mixedValue"] ?? 0,
    rawDecimal: values["rawDecimal"] ?? 0,
    roundedDecimal: values["roundedDecimal"] ?? 0,
    propagatedUncertainty: values["propagatedUncertainty"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Repeating Decimal Precision Loss","Rounding Method Bias","Measurement Uncertainty"];
  const suggestedActions: string[] = ["Use 'half_even' rounding for statistical work","Increase decimal places if repeating decimal detected","Reduce measurement uncertainty in numerator"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Batch conversion","Custom rounding rules"],
  };
}


export interface Fraction_to_decimal_calculatorOutput {
  totalWasteCost: number;
  breakdown: { fractionalValue: number; mixedValue: number; rawDecimal: number; roundedDecimal: number; propagatedUncertainty: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

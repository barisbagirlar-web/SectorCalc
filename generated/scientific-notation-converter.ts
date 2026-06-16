// Auto-generated from scientific-notation-converter-schema.json
import * as z from 'zod';

export interface Scientific_notation_converterInput {
  inputNumber: number;
  conversionDirection: string;
  significantDigits: number;
  decimalPlaces: number;
  engineeringNotation: boolean;
  useEpsilon: boolean;
}

export const Scientific_notation_converterInputSchema = z.object({
  inputNumber: z.number().min(-1e+308).max(1e+308).default(1),
  conversionDirection: z.enum(['toScientific', 'toDecimal']).default('toScientific'),
  significantDigits: z.number().min(1).max(15).default(4),
  decimalPlaces: z.number().min(0).max(15).default(4),
  engineeringNotation: z.boolean().default(false),
  useEpsilon: z.boolean().default(true),
});

function evaluateAllFormulas(input: Scientific_notation_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["subformula_absoluteValue"] = Math.abs(input.inputNumber); } catch { results["subformula_absoluteValue"] = 0; }
  try { results["subformula_exponent"] = (absVal === 0) ? 0 : Math.floor(Math.log10(absVal)); } catch { results["subformula_exponent"] = 0; }
  try { results["subformula_mantissa"] = (absVal === 0) ? 0 : parseFloat((absVal / Math.pow(10, exponent)).toPrecision(input.significantDigits)); } catch { results["subformula_mantissa"] = 0; }
  results["subformula_engineeringAdjustment"] = 0;
  try { results["subformula_signHandling"] = (input.inputNumber < 0) ? -mantissa : mantissa; } catch { results["subformula_signHandling"] = 0; }
  try { results["subformula_scientificNotation"] = signedMantissa + ' × 10^' + exponent; } catch { results["subformula_scientificNotation"] = 0; }
  results["subformula_decimalConversion"] = 0;
  return results;
}


export function calculateScientific_notation_converter(input: Scientific_notation_converterInput): Scientific_notation_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedValue"] ?? 0;
  const breakdown = {
    mantissa: values["mantissa"] ?? 0,
    exponent: values["exponent"] ?? 0,
    significantDigitsUsed: values["significantDigitsUsed"] ?? 0,
    engineeringNotationFlag: values["engineeringNotationFlag"] ?? 0,
    decimalValue: values["decimalValue"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rounding Error","Underflow Risk","Overflow Risk"];
  const suggestedActions: string[] = ["Increase Significant Digits","Disable Engineering Notation","Check Input Scale"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Scientific_notation_converterOutput {
  totalWasteCost: number;
  breakdown: { mantissa: number; exponent: number; significantDigitsUsed: number; engineeringNotationFlag: number; decimalValue: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

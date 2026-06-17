// Auto-generated from pint-to-liter-converter-calculator-schema.json
import * as z from 'zod';

export interface Pint_to_liter_converter_calculatorInput {
  pints: number;
  conversionType: number;
  batchId: number;
  temperature: number;
}

export const Pint_to_liter_converter_calculatorInputSchema = z.object({
  pints: z.number().default(0),
  conversionType: z.number().default(1),
  batchId: z.number().default(0),
  temperature: z.number().default(20),
});

function evaluateAllFormulas(input: Pint_to_liter_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const factor = input.conversionType === 1 ? 0.56826125 : input.conversionType === 2 ? 0.473176473 : 0.5506104713575; return input.pints * factor; })(); results["liters"] = Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  try { const v = (() => { const factor = input.conversionType === 1 ? 0.56826125 : input.conversionType === 2 ? 0.473176473 : 0.5506104713575; const typeName = input.conversionType === 1 ? 'UK' : input.conversionType === 2 ? 'US liquid' : 'US dry'; return [`Conversion factor: ${factor} L/pt (${typeName})`, `Pints converted: $input.pints pt`]; })(); results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = conversionFactorInfo; results["conversionFactorInfo"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorInfo"] = 0; }
  try { const v = pintsInfo; results["pintsInfo"] = Number.isFinite(v) ? v : 0; } catch { results["pintsInfo"] = 0; }
  return results;
}


export function calculatePint_to_liter_converter_calculator(input: Pint_to_liter_converter_calculatorInput): Pint_to_liter_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["liters"] ?? 0;
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


export interface Pint_to_liter_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

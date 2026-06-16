// Auto-generated from decimal-to-binary-calculator-schema.json
import * as z from 'zod';

export interface Decimal_to_binary_calculatorInput {
  decimalValue: number;
  minBits: number;
  groupSize: number;
  includePrefix: number;
  outputNumberFormat: number;
}

export const Decimal_to_binary_calculatorInputSchema = z.object({
  decimalValue: z.number().default(0),
  minBits: z.number().default(8),
  groupSize: z.number().default(0),
  includePrefix: z.number().default(0),
  outputNumberFormat: z.number().default(0),
});

function evaluateAllFormulas(input: Decimal_to_binary_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.decimalValue < 0 ? 'Error: Negative input not supported' : input.decimalValue.toString(2); results["binaryUnpadded"] = Number.isFinite(v) ? v : 0; } catch { results["binaryUnpadded"] = 0; }
  try { const v = input.minBits > 0 ? (results["binaryUnpadded"] ?? 0).padStart(input.minBits, '0') : (results["binaryUnpadded"] ?? 0); results["paddedBinary"] = Number.isFinite(v) ? v : 0; } catch { results["paddedBinary"] = 0; }
  try { const v = input.groupSize > 0 ? (results["paddedBinary"] ?? 0).match(new RegExp(`.{1,${input.groupSize}}`, 'g')).join(' ') : (results["paddedBinary"] ?? 0); results["groupedBinary"] = Number.isFinite(v) ? v : 0; } catch { results["groupedBinary"] = 0; }
  try { const v = input.includePrefix == 1 ? '0b' + (results["groupedBinary"] ?? 0) : (results["groupedBinary"] ?? 0); results["withPrefix"] = Number.isFinite(v) ? v : 0; } catch { results["withPrefix"] = 0; }
  try { const v = parseInt((results["paddedBinary"] ?? 0), 2); results["binaryAsNumber"] = Number.isFinite(v) ? v : 0; } catch { results["binaryAsNumber"] = 0; }
  try { const v = input.outputNumberFormat == 1 ? (results["binaryAsNumber"] ?? 0) : (results["withPrefix"] ?? 0); results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  return results;
}


export function calculateDecimal_to_binary_calculator(input: Decimal_to_binary_calculatorInput): Decimal_to_binary_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
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


export interface Decimal_to_binary_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

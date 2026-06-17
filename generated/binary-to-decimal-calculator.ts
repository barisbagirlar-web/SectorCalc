// Auto-generated from binary-to-decimal-calculator-schema.json
import * as z from 'zod';

export interface Binary_to_decimal_calculatorInput {
  bit7: number;
  bit6: number;
  bit5: number;
  bit4: number;
  bit3: number;
  bit2: number;
  bit1: number;
  bit0: number;
}

export const Binary_to_decimal_calculatorInputSchema = z.object({
  bit7: z.number().default(0),
  bit6: z.number().default(0),
  bit5: z.number().default(0),
  bit4: z.number().default(0),
  bit3: z.number().default(0),
  bit2: z.number().default(0),
  bit1: z.number().default(0),
  bit0: z.number().default(0),
});

function evaluateAllFormulas(input: Binary_to_decimal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bit7 * Math.pow(2, 7) + input.bit6 * Math.pow(2, 6) + input.bit5 * Math.pow(2, 5) + input.bit4 * Math.pow(2, 4) + input.bit3 * Math.pow(2, 3) + input.bit2 * Math.pow(2, 2) + input.bit1 * Math.pow(2, 1) + input.bit0 * Math.pow(2, 0); results["decimal"] = Number.isFinite(v) ? v : 0; } catch { results["decimal"] = 0; }
  try { const v = '' + input.bit7 + input.bit6 + input.bit5 + input.bit4 + input.bit3 + input.bit2 + input.bit1 + input.bit0; results["binaryString"] = Number.isFinite(v) ? v : 0; } catch { results["binaryString"] = 0; }
  results["____binaryString"] = 0;
  results["____decimal"] = 0;
  return results;
}


export function calculateBinary_to_decimal_calculator(input: Binary_to_decimal_calculatorInput): Binary_to_decimal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["decimal"] ?? 0;
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


export interface Binary_to_decimal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

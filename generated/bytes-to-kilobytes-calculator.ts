// Auto-generated from bytes-to-kilobytes-calculator-schema.json
import * as z from 'zod';

export interface Bytes_to_kilobytes_calculatorInput {
  bytes: number;
  precision: number;
  convention: number;
  roundMode: number;
  dataConfidence?: number;
}

export const Bytes_to_kilobytes_calculatorInputSchema = z.object({
  bytes: z.number().default(0),
  precision: z.number().default(2),
  convention: z.number().default(1024),
  roundMode: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bytes_to_kilobytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bytes / input.convention; results["exact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exact"] = 0; }
  try { const v = input.bytes / input.convention; results["exact_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exact_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBytes_to_kilobytes_calculator(input: Bytes_to_kilobytes_calculatorInput): Bytes_to_kilobytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["exact_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Bytes_to_kilobytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

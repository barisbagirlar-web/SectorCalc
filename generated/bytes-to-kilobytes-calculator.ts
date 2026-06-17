// @ts-nocheck
// Auto-generated from bytes-to-kilobytes-calculator-schema.json
import * as z from 'zod';

export interface Bytes_to_kilobytes_calculatorInput {
  bytes: number;
  precision: number;
  convention: number;
  roundMode: number;
}

export const Bytes_to_kilobytes_calculatorInputSchema = z.object({
  bytes: z.number().default(0),
  precision: z.number().default(2),
  convention: z.number().default(1024),
  roundMode: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bytes_to_kilobytes_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bytes / input.convention; results["exact"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exact"] = 0; }
  try { const v = input.bytes / input.convention; results["exact_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exact_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBytes_to_kilobytes_calculator(input: Bytes_to_kilobytes_calculatorInput): Bytes_to_kilobytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exact_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

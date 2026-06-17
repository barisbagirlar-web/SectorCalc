// @ts-nocheck
// Auto-generated from compression-spring-calculator-schema.json
import * as z from 'zod';

export interface Compression_spring_calculatorInput {
  d: number;
  D: number;
  n: number;
  G: number;
  F: number;
}

export const Compression_spring_calculatorInputSchema = z.object({
  d: z.number().default(2),
  D: z.number().default(20),
  n: z.number().default(10),
  G: z.number().default(80000),
  F: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compression_spring_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.D / input.d; results["C"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["C"] = 0; }
  try { const v = (4 * (asFormulaNumber(results["C"])) - 1) / (4 * (asFormulaNumber(results["C"])) - 4) + 0.615 / (asFormulaNumber(results["C"])); results["K"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["K"] = 0; }
  try { const v = input.n * input.d; results["solid_height"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["solid_height"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompression_spring_calculator(input: Compression_spring_calculatorInput): Compression_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["solid_height"]);
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


export interface Compression_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

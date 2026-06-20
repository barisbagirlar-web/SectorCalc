// Auto-generated from compression-spring-calculator-schema.json
import * as z from 'zod';

export interface Compression_spring_calculatorInput {
  d: number;
  D: number;
  n: number;
  G: number;
  F: number;
  dataConfidence?: number;
}

export const Compression_spring_calculatorInputSchema = z.object({
  d: z.number().default(2),
  D: z.number().default(20),
  n: z.number().default(10),
  G: z.number().default(80000),
  F: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compression_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.D / input.d; results["C"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["C"] = Number.NaN; }
  try { const v = (4 * (toNumericFormulaValue(results["C"])) - 1) / (4 * (toNumericFormulaValue(results["C"])) - 4) + 0.615 / (toNumericFormulaValue(results["C"])); results["K"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["K"] = Number.NaN; }
  try { const v = input.n * input.d; results["solid_height"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["solid_height"] = Number.NaN; }
  return results;
}


export function calculateCompression_spring_calculator(input: Compression_spring_calculatorInput): Compression_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["solid_height"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

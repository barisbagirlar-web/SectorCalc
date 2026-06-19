// Auto-generated from perimeter-calculator-schema.json
import * as z from 'zod';

export interface Perimeter_calculatorInput {
  side1: number;
  side2: number;
  side3: number;
  side4: number;
  side5: number;
  side6: number;
  side7: number;
  side8: number;
  dataConfidence?: number;
}

export const Perimeter_calculatorInputSchema = z.object({
  side1: z.number().default(0),
  side2: z.number().default(0),
  side3: z.number().default(0),
  side4: z.number().default(0),
  side5: z.number().default(0),
  side6: z.number().default(0),
  side7: z.number().default(0),
  side8: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Perimeter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.side1 + input.side2 + input.side3 + input.side4 + input.side5 + input.side6 + input.side7 + input.side8; results["perimeter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["perimeter"] = 0; }
  try { const v = input.side1 + input.side2 + input.side3 + input.side4 + input.side5 + input.side6 + input.side7 + input.side8; results["perimeter___side1___side2___side3___side"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["perimeter___side1___side2___side3___side"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePerimeter_calculator(input: Perimeter_calculatorInput): Perimeter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["perimeter"]);
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


export interface Perimeter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from trench-calculator-schema.json
import * as z from 'zod';

export interface Trench_calculatorInput {
  trenchLength: number;
  baseWidth: number;
  depth: number;
  sideSlope: number;
  dataConfidence?: number;
}

export const Trench_calculatorInputSchema = z.object({
  trenchLength: z.number().default(10),
  baseWidth: z.number().default(1),
  depth: z.number().default(2),
  sideSlope: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trench_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.trenchLength * input.depth * (input.baseWidth + input.sideSlope * input.depth); results["trenchVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["trenchVolume"] = 0; }
  try { const v = input.depth * (input.baseWidth + input.sideSlope * input.depth); results["crossSectionArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["crossSectionArea"] = 0; }
  try { const v = input.baseWidth + 2 * input.sideSlope * input.depth; results["topWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["topWidth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTrench_calculator(input: Trench_calculatorInput): Trench_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["trenchVolume"]));
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


export interface Trench_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

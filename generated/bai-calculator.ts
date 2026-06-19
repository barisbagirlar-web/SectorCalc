// Auto-generated from bai-calculator-schema.json
import * as z from 'zod';

export interface Bai_calculatorInput {
  landArea: number;
  totalFloorArea: number;
  builtAreaFootprint: number;
  maxFar: number;
  dataConfidence?: number;
}

export const Bai_calculatorInputSchema = z.object({
  landArea: z.number().default(1000),
  totalFloorArea: z.number().default(2000),
  builtAreaFootprint: z.number().default(500),
  maxFar: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bai_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalFloorArea / input.landArea; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.landArea; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBai_calculator(input: Bai_calculatorInput): Bai_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown"]);
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


export interface Bai_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

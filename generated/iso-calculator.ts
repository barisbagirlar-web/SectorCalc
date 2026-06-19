// Auto-generated from iso-calculator-schema.json
import * as z from 'zod';

export interface Iso_calculatorInput {
  availability: number;
  performance: number;
  quality: number;
  dataConfidence?: number;
}

export const Iso_calculatorInputSchema = z.object({
  availability: z.number().default(90),
  performance: z.number().default(95),
  quality: z.number().default(98),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Iso_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.availability / 100) * (input.performance / 100) * (input.quality / 100) * 100; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.availability; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIso_calculator(input: Iso_calculatorInput): Iso_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["breakdown"]));
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


export interface Iso_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

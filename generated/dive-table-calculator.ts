// Auto-generated from dive-table-calculator-schema.json
import * as z from 'zod';

export interface Dive_table_calculatorInput {
  diveDepth: number;
  targetPPO2: number;
  o2Fraction: number;
  dataConfidence?: number;
}

export const Dive_table_calculatorInputSchema = z.object({
  diveDepth: z.number().default(30),
  targetPPO2: z.number().default(1.4),
  o2Fraction: z.number().default(32),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dive_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.targetPPO2 / (input.o2Fraction / 100) - 1) * 10; results["mod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mod"] = Number.NaN; }
  try { const v = (input.targetPPO2 / (input.diveDepth / 10 + 1)) * 100; results["bestMix"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bestMix"] = Number.NaN; }
  return results;
}


export function calculateDive_table_calculator(input: Dive_table_calculatorInput): Dive_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mod"]);
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


export interface Dive_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

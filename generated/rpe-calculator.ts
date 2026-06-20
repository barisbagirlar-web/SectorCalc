// Auto-generated from rpe-calculator-schema.json
import * as z from 'zod';

export interface Rpe_calculatorInput {
  coRev: number;
  coEmp: number;
  indRev: number;
  indEmp: number;
  dataConfidence?: number;
}

export const Rpe_calculatorInputSchema = z.object({
  coRev: z.number().default(1000000),
  coEmp: z.number().default(50),
  indRev: z.number().default(5000000),
  indEmp: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rpe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coRev / input.coEmp; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.coRev; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  return results;
}


export function calculateRpe_calculator(input: Rpe_calculatorInput): Rpe_calculatorOutput {
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


export interface Rpe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

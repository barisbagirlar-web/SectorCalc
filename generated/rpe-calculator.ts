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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rpe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coRev / input.coEmp; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.coRev; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRpe_calculator(input: Rpe_calculatorInput): Rpe_calculatorOutput {
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


export interface Rpe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

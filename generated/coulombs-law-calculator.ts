// Auto-generated from coulombs-law-calculator-schema.json
import * as z from 'zod';

export interface Coulombs_law_calculatorInput {
  charge1: number;
  charge2: number;
  distance: number;
  permittivity: number;
  dataConfidence?: number;
}

export const Coulombs_law_calculatorInputSchema = z.object({
  charge1: z.number().default(0.000001),
  charge2: z.number().default(0.000001),
  distance: z.number().default(1),
  permittivity: z.number().default(8.854187817e-12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Coulombs_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.charge1 * input.charge2) / (4 * Math.PI * input.permittivity * input.distance * input.distance)); results["force"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["force"] = 0; }
  try { const v = ((input.charge1 * input.charge2) / (4 * Math.PI * input.permittivity * input.distance * input.distance)); results["force_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["force_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCoulombs_law_calculator(input: Coulombs_law_calculatorInput): Coulombs_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["force"]));
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


export interface Coulombs_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

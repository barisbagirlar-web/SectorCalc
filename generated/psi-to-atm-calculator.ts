// Auto-generated from psi-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Psi_to_atm_calculatorInput {
  pressurePsi: number;
  factor: number;
  offset: number;
  precision: number;
  dataConfidence?: number;
}

export const Psi_to_atm_calculatorInputSchema = z.object({
  pressurePsi: z.number().default(0),
  factor: z.number().default(0.0680459639),
  offset: z.number().default(0),
  precision: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Psi_to_atm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressurePsi + input.offset; results["adjustedPsi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedPsi"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedPsi"])) * input.factor; results["atm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["atm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePsi_to_atm_calculator(input: Psi_to_atm_calculatorInput): Psi_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["atm"]));
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


export interface Psi_to_atm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

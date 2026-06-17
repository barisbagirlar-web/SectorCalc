// @ts-nocheck
// Auto-generated from psi-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Psi_to_atm_calculatorInput {
  pressurePsi: number;
  factor: number;
  offset: number;
  precision: number;
}

export const Psi_to_atm_calculatorInputSchema = z.object({
  pressurePsi: z.number().default(0),
  factor: z.number().default(0.0680459639),
  offset: z.number().default(0),
  precision: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Psi_to_atm_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressurePsi + input.offset; results["adjustedPsi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedPsi"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedPsi"])) * input.factor; results["atm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePsi_to_atm_calculator(input: Psi_to_atm_calculatorInput): Psi_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atm"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

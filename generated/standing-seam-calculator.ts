// @ts-nocheck
// Auto-generated from standing-seam-calculator-schema.json
import * as z from 'zod';

export interface Standing_seam_calculatorInput {
  roofLength: number;
  roofWidth: number;
  panelCoverage: number;
  overhang: number;
  clipSpacing: number;
}

export const Standing_seam_calculatorInputSchema = z.object({
  roofLength: z.number().default(30),
  roofWidth: z.number().default(50),
  panelCoverage: z.number().default(16),
  overhang: z.number().default(2),
  clipSpacing: z.number().default(24),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Standing_seam_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.roofLength + (input.overhang / 12); results["panelLengthActual"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["panelLengthActual"] = 0; }
  try { const v = input.roofLength + (input.overhang / 12); results["panelLengthActual_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["panelLengthActual_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStanding_seam_calculator(input: Standing_seam_calculatorInput): Standing_seam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["panelLengthActual_aux"]);
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


export interface Standing_seam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from standing-seam-calculator-schema.json
import * as z from 'zod';

export interface Standing_seam_calculatorInput {
  roofLength: number;
  roofWidth: number;
  panelCoverage: number;
  overhang: number;
  clipSpacing: number;
  dataConfidence?: number;
}

export const Standing_seam_calculatorInputSchema = z.object({
  roofLength: z.number().default(30),
  roofWidth: z.number().default(50),
  panelCoverage: z.number().default(16),
  overhang: z.number().default(2),
  clipSpacing: z.number().default(24),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standing_seam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofLength + (input.overhang / 12); results["panelLengthActual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["panelLengthActual"] = Number.NaN; }
  try { const v = input.roofWidth * (input.roofLength + input.overhang / 12); results["totalLinearFeet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLinearFeet"] = Number.NaN; }
  return results;
}


export function calculateStanding_seam_calculator(input: Standing_seam_calculatorInput): Standing_seam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["panelLengthActual"]);
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


export interface Standing_seam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

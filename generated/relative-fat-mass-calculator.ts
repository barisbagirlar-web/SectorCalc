// Auto-generated from relative-fat-mass-calculator-schema.json
import * as z from 'zod';

export interface Relative_fat_mass_calculatorInput {
  height: number;
  waist: number;
  sex: number;
  dataConfidence?: number;
}

export const Relative_fat_mass_calculatorInputSchema = z.object({
  height: z.number().default(170),
  waist: z.number().default(80),
  sex: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Relative_fat_mass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex === 1 ? 76 - 20 * (input.height / input.waist) : 64 - 20 * (input.height / input.waist); results["RFM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RFM"] = Number.NaN; }
  try { const v = input.height / input.waist; results["heightToWaistRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heightToWaistRatio"] = Number.NaN; }
  try { const v = 20 * (input.height / input.waist); results["twentyTimesRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["twentyTimesRatio"] = Number.NaN; }
  try { const v = input.sex === 1 ? 76 : 64; results["constant"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["constant"] = Number.NaN; }
  return results;
}


export function calculateRelative_fat_mass_calculator(input: Relative_fat_mass_calculatorInput): Relative_fat_mass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RFM"]);
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


export interface Relative_fat_mass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

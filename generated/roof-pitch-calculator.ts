// Auto-generated from roof-pitch-calculator-schema.json
import * as z from 'zod';

export interface Roof_pitch_calculatorInput {
  rise: number;
  span: number;
  length: number;
  overhang: number;
  dataConfidence?: number;
}

export const Roof_pitch_calculatorInputSchema = z.object({
  rise: z.number().default(2),
  span: z.number().default(8),
  length: z.number().default(10),
  overhang: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roof_pitch_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.span / 2; results["run"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["run"] = Number.NaN; }
  try { const v = input.rise / (toNumericFormulaValue(results["run"])); results["pitchRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pitchRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pitchRatio"])) * 100; results["slopePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slopePercent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pitchRatio"])) * 12; results["pitchImperial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pitchImperial"] = Number.NaN; }
  return results;
}


export function calculateRoof_pitch_calculator(input: Roof_pitch_calculatorInput): Roof_pitch_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pitchImperial"]);
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


export interface Roof_pitch_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

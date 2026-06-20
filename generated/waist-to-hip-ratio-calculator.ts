// Auto-generated from waist-to-hip-ratio-calculator-schema.json
import * as z from 'zod';

export interface Waist_to_hip_ratio_calculatorInput {
  waist: number;
  hip: number;
  height: number;
  weight: number;
  gender: number;
  dataConfidence?: number;
}

export const Waist_to_hip_ratio_calculatorInputSchema = z.object({
  waist: z.number().default(0),
  hip: z.number().default(0),
  height: z.number().default(0),
  weight: z.number().default(0),
  gender: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Waist_to_hip_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waist / input.hip; results["waistToHipRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waistToHipRatio"] = Number.NaN; }
  try { const v = input.waist / input.height; results["waistToHeightRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waistToHeightRatio"] = Number.NaN; }
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi"] = Number.NaN; }
  try { const v = input.gender === 0 ? ( (input.waist/input.hip) > 0.85 ? 1 : 0 ) : ( (input.waist/input.hip) > 0.90 ? 1 : 0 ); results["highRiskWHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["highRiskWHR"] = Number.NaN; }
  return results;
}


export function calculateWaist_to_hip_ratio_calculator(input: Waist_to_hip_ratio_calculatorInput): Waist_to_hip_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["waistToHipRatio"]);
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


export interface Waist_to_hip_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

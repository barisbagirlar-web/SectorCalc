// Auto-generated from subjective-well-being-calculator-schema.json
import * as z from 'zod';

export interface Subjective_well_being_calculatorInput {
  physical: number;
  mental: number;
  social: number;
  emotional: number;
  spiritual: number;
  dataConfidence?: number;
}

export const Subjective_well_being_calculatorInputSchema = z.object({
  physical: z.number().default(5),
  mental: z.number().default(5),
  social: z.number().default(5),
  emotional: z.number().default(5),
  spiritual: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Subjective_well_being_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.physical + input.mental + input.social + input.emotional + input.spiritual) / 5; results["overallScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  try { const v = input.physical; results["physical"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["physical"] = 0; }
  try { const v = input.mental; results["mental"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mental"] = 0; }
  try { const v = input.social; results["social"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["social"] = 0; }
  try { const v = input.emotional; results["emotional"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["emotional"] = 0; }
  try { const v = input.spiritual; results["spiritual"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["spiritual"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSubjective_well_being_calculator(input: Subjective_well_being_calculatorInput): Subjective_well_being_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
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


export interface Subjective_well_being_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

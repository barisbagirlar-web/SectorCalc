// Auto-generated from beam-calculator-schema.json
import * as z from 'zod';

export interface Beam_calculatorInput {
  load: number;
  span: number;
  elasticModulus: number;
  momentOfInertia: number;
  dataConfidence?: number;
}

export const Beam_calculatorInputSchema = z.object({
  load: z.number().default(10),
  span: z.number().default(5),
  elasticModulus: z.number().default(200),
  momentOfInertia: z.number().default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.load * input.span) / 4; results["maxBendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxBendingMoment"] = Number.NaN; }
  try { const v = (input.load * input.span) / 4; results["maxBendingMoment_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxBendingMoment_aux"] = Number.NaN; }
  return results;
}


export function calculateBeam_calculator(input: Beam_calculatorInput): Beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxBendingMoment"]);
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


export interface Beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

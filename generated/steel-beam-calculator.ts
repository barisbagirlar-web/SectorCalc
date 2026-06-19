// Auto-generated from steel-beam-calculator-schema.json
import * as z from 'zod';

export interface Steel_beam_calculatorInput {
  spanLength: number;
  udl: number;
  elasticModulus: number;
  momentInertia: number;
  yieldStrength: number;
  sectionModulus: number;
  dataConfidence?: number;
}

export const Steel_beam_calculatorInputSchema = z.object({
  spanLength: z.number().default(5000),
  udl: z.number().default(50),
  elasticModulus: z.number().default(200000),
  momentInertia: z.number().default(1000000),
  yieldStrength: z.number().default(250),
  sectionModulus: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Steel_beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.udl * input.spanLength**2 / 8 * 1e-6; results["maxBendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxBendingMoment"] = 0; }
  try { const v = input.udl * input.spanLength / 2 * 1e-3; results["maxShearForce"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxShearForce"] = 0; }
  try { const v = 5 * input.udl * input.spanLength**4 / (384 * input.elasticModulus * input.momentInertia); results["maxDeflection"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxDeflection"] = 0; }
  try { const v = (input.udl * input.spanLength**2 / 8) / input.sectionModulus; results["bendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bendingStress"] = 0; }
  try { const v = input.yieldStrength / ((input.udl * input.spanLength**2 / 8) / input.sectionModulus); results["safetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSteel_beam_calculator(input: Steel_beam_calculatorInput): Steel_beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["maxDeflection"]));
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


export interface Steel_beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

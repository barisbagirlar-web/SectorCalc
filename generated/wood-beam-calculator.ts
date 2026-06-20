// Auto-generated from wood-beam-calculator-schema.json
import * as z from 'zod';

export interface Wood_beam_calculatorInput {
  span: number;
  load: number;
  width: number;
  depth: number;
  modulusElasticity: number;
  allowableStress: number;
  dataConfidence?: number;
}

export const Wood_beam_calculatorInputSchema = z.object({
  span: z.number().default(3.5),
  load: z.number().default(5),
  width: z.number().default(100),
  depth: z.number().default(200),
  modulusElasticity: z.number().default(10000),
  allowableStress: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wood_beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.load * (input.span * 1000) ** 2 / 8; results["M"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["M"] = Number.NaN; }
  try { const v = input.width * input.depth ** 2 / 6; results["S"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["S"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["M"])) / (toNumericFormulaValue(results["S"])); results["bendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStress"] = Number.NaN; }
  try { const v = input.width * input.depth ** 3 / 12; results["I"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["I"] = Number.NaN; }
  try { const v = (5 * input.load * (input.span * 1000) ** 4) / (384 * input.modulusElasticity * (toNumericFormulaValue(results["I"]))); results["deflection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deflection"] = Number.NaN; }
  try { const v = (input.span * 1000) / 360; results["allowableDeflection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableDeflection"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bendingStress"])) / input.allowableStress; results["stressRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stressRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deflection"])) / (toNumericFormulaValue(results["allowableDeflection"])); results["deflectionRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deflectionRatio"] = Number.NaN; }
  return results;
}


export function calculateWood_beam_calculator(input: Wood_beam_calculatorInput): Wood_beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deflectionRatio"]);
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


export interface Wood_beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

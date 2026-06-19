// Auto-generated from concrete-curbs-calculator-schema.json
import * as z from 'zod';

export interface Concrete_curbs_calculatorInput {
  curbLength: number;
  curbWidth: number;
  curbHeight: number;
  curbCount: number;
  concreteDensity: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Concrete_curbs_calculatorInputSchema = z.object({
  curbLength: z.number().default(1),
  curbWidth: z.number().default(0.15),
  curbHeight: z.number().default(0.2),
  curbCount: z.number().default(100),
  concreteDensity: z.number().default(2400),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_curbs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.curbLength * input.curbWidth * input.curbHeight; results["volumePerCurb"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumePerCurb"] = 0; }
  try { const v = input.curbLength * input.curbWidth * input.curbHeight * input.curbCount * (1 + input.wasteFactor / 100); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = input.curbLength * input.curbWidth * input.curbHeight * input.curbCount * (1 + input.wasteFactor / 100) * input.concreteDensity; results["totalWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightKg"] = 0; }
  try { const v = input.curbLength * input.curbWidth * input.curbHeight * input.curbCount * (1 + input.wasteFactor / 100) * input.concreteDensity / 1000; results["totalWeightTon"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightTon"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_curbs_calculator(input: Concrete_curbs_calculatorInput): Concrete_curbs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeightTon"]);
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


export interface Concrete_curbs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

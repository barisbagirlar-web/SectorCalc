// Auto-generated from concrete-stairs-calculator-schema.json
import * as z from 'zod';

export interface Concrete_stairs_calculatorInput {
  totalRise: number;
  numberOfSteps: number;
  treadDepth: number;
  stepWidth: number;
  waistThickness: number;
  landingLength: number;
  dataConfidence?: number;
}

export const Concrete_stairs_calculatorInputSchema = z.object({
  totalRise: z.number().default(3000),
  numberOfSteps: z.number().default(15),
  treadDepth: z.number().default(280),
  stepWidth: z.number().default(1000),
  waistThickness: z.number().default(150),
  landingLength: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Concrete_stairs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise / input.numberOfSteps; results["riserHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riserHeight"] = Number.NaN; }
  try { const v = (input.numberOfSteps - 1) * input.treadDepth; results["horizontalRun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horizontalRun"] = Number.NaN; }
  try { const v = input.numberOfSteps * 0.5 * input.treadDepth * (toNumericFormulaValue(results["riserHeight"])) * input.stepWidth; results["volumeSteps_mm3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeSteps_mm3"] = Number.NaN; }
  try { const v = input.landingLength * input.stepWidth * input.waistThickness; results["volumeLanding_mm3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeLanding_mm3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumeSteps_mm3"])) / 1e9; results["volumeSteps_m3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeSteps_m3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumeLanding_mm3"])) / 1e9; results["volumeLanding_m3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeLanding_m3"] = Number.NaN; }
  return results;
}


export function calculateConcrete_stairs_calculator(input: Concrete_stairs_calculatorInput): Concrete_stairs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volumeLanding_m3"]);
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


export interface Concrete_stairs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

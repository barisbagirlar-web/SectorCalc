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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_stairs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise / input.numberOfSteps; results["riserHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = (input.numberOfSteps - 1) * input.treadDepth; results["horizontalRun"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["horizontalRun"] = 0; }
  try { const v = input.numberOfSteps * 0.5 * input.treadDepth * (asFormulaNumber(results["riserHeight"])) * input.stepWidth; results["volumeSteps_mm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeSteps_mm3"] = 0; }
  try { const v = input.landingLength * input.stepWidth * input.waistThickness; results["volumeLanding_mm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeLanding_mm3"] = 0; }
  try { const v = (asFormulaNumber(results["volumeSteps_mm3"])) / 1e9; results["volumeSteps_m3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeSteps_m3"] = 0; }
  try { const v = (asFormulaNumber(results["volumeLanding_mm3"])) / 1e9; results["volumeLanding_m3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeLanding_m3"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_stairs_calculator(input: Concrete_stairs_calculatorInput): Concrete_stairs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volumeLanding_m3"]));
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


export interface Concrete_stairs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

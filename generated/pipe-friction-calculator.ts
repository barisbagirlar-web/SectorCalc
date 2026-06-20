// Auto-generated from pipe-friction-calculator-schema.json
import * as z from 'zod';

export interface Pipe_friction_calculatorInput {
  pipeLength: number;
  innerDiameter: number;
  flowRate: number;
  roughness: number;
  fluidDensity: number;
  dynamicViscosity: number;
  dataConfidence?: number;
}

export const Pipe_friction_calculatorInputSchema = z.object({
  pipeLength: z.number().default(100),
  innerDiameter: z.number().default(50),
  flowRate: z.number().default(10),
  roughness: z.number().default(0.045),
  fluidDensity: z.number().default(1000),
  dynamicViscosity: z.number().default(0.001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pipe_friction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.innerDiameter / 1000; results["diameterM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diameterM"] = Number.NaN; }
  try { const v = input.flowRate / 1000; results["flowRateM3ps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowRateM3ps"] = Number.NaN; }
  try { const v = Math.PI * ((toNumericFormulaValue(results["diameterM"])) / 2) ** 2; results["crossArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crossArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flowRateM3ps"])) / (toNumericFormulaValue(results["crossArea"])); results["velocity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["velocity"] = Number.NaN; }
  try { const v = input.fluidDensity * (toNumericFormulaValue(results["velocity"])) * (toNumericFormulaValue(results["diameterM"])) / input.dynamicViscosity; results["reynoldsNumber"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reynoldsNumber"] = Number.NaN; }
  return results;
}


export function calculatePipe_friction_calculator(input: Pipe_friction_calculatorInput): Pipe_friction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reynoldsNumber"]);
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


export interface Pipe_friction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

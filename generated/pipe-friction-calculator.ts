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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_friction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.innerDiameter / 1000; results["diameterM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["diameterM"] = 0; }
  try { const v = input.flowRate / 1000; results["flowRateM3ps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flowRateM3ps"] = 0; }
  try { const v = Math.PI * ((asFormulaNumber(results["diameterM"])) / 2) ** 2; results["crossArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["crossArea"] = 0; }
  try { const v = (asFormulaNumber(results["flowRateM3ps"])) / (asFormulaNumber(results["crossArea"])); results["velocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = input.fluidDensity * (asFormulaNumber(results["velocity"])) * (asFormulaNumber(results["diameterM"])) / input.dynamicViscosity; results["reynoldsNumber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePipe_friction_calculator(input: Pipe_friction_calculatorInput): Pipe_friction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["reynoldsNumber"]));
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


export interface Pipe_friction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

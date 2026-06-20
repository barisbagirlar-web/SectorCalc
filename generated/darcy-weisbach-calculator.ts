// Auto-generated from darcy-weisbach-calculator-schema.json
import * as z from 'zod';

export interface Darcy_weisbach_calculatorInput {
  pipeDiameter: number;
  pipeLength: number;
  frictionFactor: number;
  fluidDensity: number;
  flowRate: number;
  dataConfidence?: number;
}

export const Darcy_weisbach_calculatorInputSchema = z.object({
  pipeDiameter: z.number().default(0.1),
  pipeLength: z.number().default(100),
  frictionFactor: z.number().default(0.02),
  fluidDensity: z.number().default(1000),
  flowRate: z.number().default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Darcy_weisbach_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate / (Math.PI * (input.pipeDiameter ** 2) / 4); results["velocity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["velocity"] = Number.NaN; }
  try { const v = input.frictionFactor * (input.pipeLength / input.pipeDiameter) * 0.5 * input.fluidDensity * ((toNumericFormulaValue(results["velocity"])) ** 2); results["pressureLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressureLoss"])) / (input.fluidDensity * 9.81); results["headLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["headLoss"] = Number.NaN; }
  return results;
}


export function calculateDarcy_weisbach_calculator(input: Darcy_weisbach_calculatorInput): Darcy_weisbach_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressureLoss"]);
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


export interface Darcy_weisbach_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

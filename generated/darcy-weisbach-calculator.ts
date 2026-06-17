// @ts-nocheck
// Auto-generated from darcy-weisbach-calculator-schema.json
import * as z from 'zod';

export interface Darcy_weisbach_calculatorInput {
  pipeDiameter: number;
  pipeLength: number;
  frictionFactor: number;
  fluidDensity: number;
  flowRate: number;
}

export const Darcy_weisbach_calculatorInputSchema = z.object({
  pipeDiameter: z.number().default(0.1),
  pipeLength: z.number().default(100),
  frictionFactor: z.number().default(0.02),
  fluidDensity: z.number().default(1000),
  flowRate: z.number().default(0.01),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Darcy_weisbach_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.flowRate / (Math.PI * (input.pipeDiameter ** 2) / 4); results["velocity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = input.frictionFactor * (input.pipeLength / input.pipeDiameter) * 0.5 * input.fluidDensity * ((asFormulaNumber(results["velocity"])) ** 2); results["pressureLoss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressureLoss"] = 0; }
  try { const v = (asFormulaNumber(results["pressureLoss"])) / (input.fluidDensity * 9.81); results["headLoss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["headLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDarcy_weisbach_calculator(input: Darcy_weisbach_calculatorInput): Darcy_weisbach_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressureLoss"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

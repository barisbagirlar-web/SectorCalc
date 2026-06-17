// @ts-nocheck
// Auto-generated from lh-surge-calculator-schema.json
import * as z from 'zod';

export interface Lh_surge_calculatorInput {
  flowVelocity: number;
  pipeDiameter: number;
  pipeLength: number;
  valveCloseTime: number;
  waveSpeed: number;
  fluidDensity: number;
  wallThickness: number;
}

export const Lh_surge_calculatorInputSchema = z.object({
  flowVelocity: z.number().default(2),
  pipeDiameter: z.number().default(0.3),
  pipeLength: z.number().default(100),
  valveCloseTime: z.number().default(1),
  waveSpeed: z.number().default(1200),
  fluidDensity: z.number().default(1000),
  wallThickness: z.number().default(0.01),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lh_surge_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.flowVelocity + input.pipeDiameter + input.pipeLength; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.flowVelocity + input.pipeDiameter + input.pipeLength; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLh_surge_calculator(input: Lh_surge_calculatorInput): Lh_surge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Lh_surge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

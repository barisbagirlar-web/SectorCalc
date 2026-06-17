// @ts-nocheck
// Auto-generated from banjo-calculator-schema.json
import * as z from 'zod';

export interface Banjo_calculatorInput {
  boltInnerDiameter: number;
  holeDiameter: number;
  numberOfHoles: number;
  fluidDensity: number;
  fluidViscosity: number;
  pressureDifference: number;
  dischargeCoefficient: number;
}

export const Banjo_calculatorInputSchema = z.object({
  boltInnerDiameter: z.number().default(10),
  holeDiameter: z.number().default(5),
  numberOfHoles: z.number().default(2),
  fluidDensity: z.number().default(870),
  fluidViscosity: z.number().default(0.028),
  pressureDifference: z.number().default(100000),
  dischargeCoefficient: z.number().default(0.62),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Banjo_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.boltInnerDiameter + input.holeDiameter + input.numberOfHoles; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.boltInnerDiameter + input.holeDiameter + input.numberOfHoles; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBanjo_calculator(input: Banjo_calculatorInput): Banjo_calculatorOutput {
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


export interface Banjo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

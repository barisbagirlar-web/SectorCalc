// @ts-nocheck
// Auto-generated from spring-force-calculator-schema.json
import * as z from 'zod';

export interface Spring_force_calculatorInput {
  springConstant: number;
  displacement: number;
  wireDiameter: number;
  coilDiameter: number;
  activeCoils: number;
  shearModulus: number;
}

export const Spring_force_calculatorInputSchema = z.object({
  springConstant: z.number().default(0),
  displacement: z.number().default(10),
  wireDiameter: z.number().default(2),
  coilDiameter: z.number().default(20),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(80000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spring_force_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.displacement; results["displacement"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["displacement"] = 0; }
  try { const v = input.displacement; results["displacement_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["displacement_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSpring_force_calculator(input: Spring_force_calculatorInput): Spring_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["displacement_aux"]);
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


export interface Spring_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

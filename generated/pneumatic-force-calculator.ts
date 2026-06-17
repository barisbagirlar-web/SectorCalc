// @ts-nocheck
// Auto-generated from pneumatic-force-calculator-schema.json
import * as z from 'zod';

export interface Pneumatic_force_calculatorInput {
  systemPressure: number;
  boreDiameter: number;
  rodDiameter: number;
  cylinderCount: number;
  safetyFactor: number;
  efficiency: number;
}

export const Pneumatic_force_calculatorInputSchema = z.object({
  systemPressure: z.number().default(6),
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(25),
  cylinderCount: z.number().default(1),
  safetyFactor: z.number().default(1.5),
  efficiency: z.number().default(0.9),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pneumatic_force_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.systemPressure + input.boreDiameter + input.rodDiameter; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.systemPressure + input.boreDiameter + input.rodDiameter; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePneumatic_force_calculator(input: Pneumatic_force_calculatorInput): Pneumatic_force_calculatorOutput {
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


export interface Pneumatic_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

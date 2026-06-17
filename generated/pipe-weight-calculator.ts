// @ts-nocheck
// Auto-generated from pipe-weight-calculator-schema.json
import * as z from 'zod';

export interface Pipe_weight_calculatorInput {
  outerDiameter: number;
  wallThickness: number;
  length: number;
  density: number;
  quantity: number;
}

export const Pipe_weight_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(219.1),
  wallThickness: z.number().default(8.18),
  length: z.number().default(6),
  density: z.number().default(7850),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_weight_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness); results["crossSectionalArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness) * input.density / 1e6; results["linearMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["linearMass"] = 0; }
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness) * input.density * input.length * input.quantity / 1e6; results["weight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePipe_weight_calculator(input: Pipe_weight_calculatorInput): Pipe_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weight"]);
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


export interface Pipe_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

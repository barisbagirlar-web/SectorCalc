// @ts-nocheck
// Auto-generated from flange-calculator-schema.json
import * as z from 'zod';

export interface Flange_calculatorInput {
  outerDiameter: number;
  thickness: number;
  boltCircleDiameter: number;
  numberOfBolts: number;
  boltHoleDiameter: number;
  density: number;
}

export const Flange_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(200),
  thickness: z.number().default(20),
  boltCircleDiameter: z.number().default(160),
  numberOfBolts: z.number().default(8),
  boltHoleDiameter: z.number().default(18),
  density: z.number().default(7850),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flange_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.outerDiameter + input.thickness + input.boltCircleDiameter; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.outerDiameter + input.thickness + input.boltCircleDiameter; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFlange_calculator(input: Flange_calculatorInput): Flange_calculatorOutput {
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


export interface Flange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

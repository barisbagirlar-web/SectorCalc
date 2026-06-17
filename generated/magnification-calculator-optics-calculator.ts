// @ts-nocheck
// Auto-generated from magnification-calculator-optics-calculator-schema.json
import * as z from 'zod';

export interface Magnification_calculator_optics_calculatorInput {
  focalLength: number;
  objectDistance: number;
  auto_input_3: number;
}

export const Magnification_calculator_optics_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  objectDistance: z.number().default(100),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Magnification_calculator_optics_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.focalLength * input.objectDistance) / (input.objectDistance - input.focalLength); results["imageDistance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["imageDistance"] = 0; }
  try { const v = - (asFormulaNumber(results["imageDistance"])) / input.objectDistance; results["magnification"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["magnification"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMagnification_calculator_optics_calculator(input: Magnification_calculator_optics_calculatorInput): Magnification_calculator_optics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["magnification"]);
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


export interface Magnification_calculator_optics_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

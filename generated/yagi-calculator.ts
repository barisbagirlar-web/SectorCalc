// @ts-nocheck
// Auto-generated from yagi-calculator-schema.json
import * as z from 'zod';

export interface Yagi_calculatorInput {
  frequency: number;
  numElements: number;
  velocityFactor: number;
  spacingFactor: number;
}

export const Yagi_calculatorInputSchema = z.object({
  frequency: z.number().default(144),
  numElements: z.number().default(3),
  velocityFactor: z.number().default(0.95),
  spacingFactor: z.number().default(0.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Yagi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 300 / input.frequency; results["wavelength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wavelength"] = 0; }
  try { const v = 0.5 * (asFormulaNumber(results["wavelength"])) * input.velocityFactor; results["drivenElement"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["drivenElement"] = 0; }
  try { const v = (asFormulaNumber(results["drivenElement"])) * 1.05; results["reflectorLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reflectorLength"] = 0; }
  try { const v = (input.numElements - 1) * input.spacingFactor * (asFormulaNumber(results["wavelength"])); results["boomLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["boomLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateYagi_calculator(input: Yagi_calculatorInput): Yagi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["boomLength"]);
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


export interface Yagi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

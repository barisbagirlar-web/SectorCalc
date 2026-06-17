// @ts-nocheck
// Auto-generated from pd-calculator-schema.json
import * as z from 'zod';

export interface Pd_calculatorInput {
  diameter: number;
  length: number;
  flowRate: number;
  density: number;
  viscosity: number;
  roughness: number;
}

export const Pd_calculatorInputSchema = z.object({
  diameter: z.number().default(0.1),
  length: z.number().default(100),
  flowRate: z.number().default(0.01),
  density: z.number().default(998.2),
  viscosity: z.number().default(0.001002),
  roughness: z.number().default(0.000046),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pd_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * input.diameter * input.diameter / 4; results["area"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.flowRate / (asFormulaNumber(results["area"])); results["velocity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = (input.density * (asFormulaNumber(results["velocity"])) * input.diameter) / input.viscosity; results["reynoldsNumber"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePd_calculator(input: Pd_calculatorInput): Pd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reynoldsNumber"]);
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


export interface Pd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

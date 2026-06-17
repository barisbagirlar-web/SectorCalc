// @ts-nocheck
// Auto-generated from lmtd-calculator-schema.json
import * as z from 'zod';

export interface Lmtd_calculatorInput {
  thIn: number;
  thOut: number;
  tcIn: number;
  tcOut: number;
  flowType: number;
}

export const Lmtd_calculatorInputSchema = z.object({
  thIn: z.number().default(90),
  thOut: z.number().default(70),
  tcIn: z.number().default(30),
  tcOut: z.number().default(50),
  flowType: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lmtd_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.flowType === 1 ? (input.thIn - input.tcOut) : (input.thIn - input.tcIn)) ? 1 : 0); results["deltaT1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deltaT1"] = 0; }
  try { const v = ((input.flowType === 1 ? (input.thOut - input.tcIn) : (input.thOut - input.tcOut)) ? 1 : 0); results["deltaT2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deltaT2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLmtd_calculator(input: Lmtd_calculatorInput): Lmtd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deltaT2"]);
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


export interface Lmtd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

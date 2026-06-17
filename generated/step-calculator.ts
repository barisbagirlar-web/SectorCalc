// @ts-nocheck
// Auto-generated from step-calculator-schema.json
import * as z from 'zod';

export interface Step_calculatorInput {
  totalHeight: number;
  stepHeight: number;
  stepDepth: number;
  landingWidth: number;
  headroom: number;
}

export const Step_calculatorInputSchema = z.object({
  totalHeight: z.number().default(280),
  stepHeight: z.number().default(18),
  stepDepth: z.number().default(28),
  landingWidth: z.number().default(100),
  headroom: z.number().default(210),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Step_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalHeight + input.stepHeight + input.stepDepth; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.totalHeight + input.stepHeight + input.stepDepth; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStep_calculator(input: Step_calculatorInput): Step_calculatorOutput {
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


export interface Step_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

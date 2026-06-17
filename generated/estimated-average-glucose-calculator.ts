// @ts-nocheck
// Auto-generated from estimated-average-glucose-calculator-schema.json
import * as z from 'zod';

export interface Estimated_average_glucose_calculatorInput {
  hba1c: number;
  factor_mgdl: number;
  offset_mgdl: number;
  factor_mmol: number;
  offset_mmol: number;
}

export const Estimated_average_glucose_calculatorInputSchema = z.object({
  hba1c: z.number().default(7),
  factor_mgdl: z.number().default(28.7),
  offset_mgdl: z.number().default(-46.7),
  factor_mmol: z.number().default(1.59),
  offset_mmol: z.number().default(-2.59),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Estimated_average_glucose_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.factor_mgdl * input.hba1c + input.offset_mgdl; results["eag_mgdl"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eag_mgdl"] = 0; }
  try { const v = input.factor_mmol * input.hba1c + input.offset_mmol; results["eag_mmol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eag_mmol"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEstimated_average_glucose_calculator(input: Estimated_average_glucose_calculatorInput): Estimated_average_glucose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["eag_mmol"]);
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


export interface Estimated_average_glucose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

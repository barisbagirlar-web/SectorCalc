// @ts-nocheck
// Auto-generated from anxiety-calculator-schema.json
import * as z from 'zod';

export interface Anxiety_calculatorInput {
  measurement_variance: number;
  operator_error_rate: number;
  machine_downtime: number;
  defect_rate: number;
  process_temperature_variance: number;
  noise_level: number;
}

export const Anxiety_calculatorInputSchema = z.object({
  measurement_variance: z.number().default(0.1),
  operator_error_rate: z.number().default(2),
  machine_downtime: z.number().default(0.05),
  defect_rate: z.number().default(1.5),
  process_temperature_variance: z.number().default(2.1),
  noise_level: z.number().default(75),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Anxiety_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.3 * input.machine_downtime * 100; results["machine_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machine_factor"] = 0; }
  try { const v = 0.3 * input.machine_downtime * 100; results["machine_factor_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machine_factor_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAnxiety_calculator(input: Anxiety_calculatorInput): Anxiety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["machine_factor_aux"]);
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


export interface Anxiety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

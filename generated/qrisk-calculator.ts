// @ts-nocheck
// Auto-generated from qrisk-calculator-schema.json
import * as z from 'zod';

export interface Qrisk_calculatorInput {
  age: number;
  systolicBP: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  smoker: number;
  diabetes: number;
}

export const Qrisk_calculatorInputSchema = z.object({
  age: z.number().default(50),
  systolicBP: z.number().default(120),
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  smoker: z.number().default(0),
  diabetes: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Qrisk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = -5.5 + 0.05 * input.age + 0.01 * input.systolicBP + 0.005 * input.totalCholesterol - 0.008 * input.hdlCholesterol + 0.5 * input.smoker + 0.3 * input.diabetes; results["beta"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["beta"] = 0; }
  try { const v = -5.5 + 0.05 * input.age + 0.01 * input.systolicBP + 0.005 * input.totalCholesterol - 0.008 * input.hdlCholesterol + 0.5 * input.smoker + 0.3 * input.diabetes; results["beta_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["beta_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateQrisk_calculator(input: Qrisk_calculatorInput): Qrisk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["beta_aux"]);
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


export interface Qrisk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

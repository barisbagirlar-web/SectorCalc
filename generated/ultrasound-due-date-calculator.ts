// @ts-nocheck
// Auto-generated from ultrasound-due-date-calculator-schema.json
import * as z from 'zod';

export interface Ultrasound_due_date_calculatorInput {
  currentThicknessMm: number;
  minThicknessMm: number;
  corrosionRateMmPerYear: number;
  measurementConfidenceFactor: number;
}

export const Ultrasound_due_date_calculatorInputSchema = z.object({
  currentThicknessMm: z.number().default(10),
  minThicknessMm: z.number().default(5),
  corrosionRateMmPerYear: z.number().default(0.2),
  measurementConfidenceFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ultrasound_due_date_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.corrosionRateMmPerYear * input.measurementConfidenceFactor; results["effectiveCorrosionRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveCorrosionRate"] = 0; }
  try { const v = input.corrosionRateMmPerYear * input.measurementConfidenceFactor; results["effectiveCorrosionRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveCorrosionRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateUltrasound_due_date_calculator(input: Ultrasound_due_date_calculatorInput): Ultrasound_due_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveCorrosionRate_aux"]);
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


export interface Ultrasound_due_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

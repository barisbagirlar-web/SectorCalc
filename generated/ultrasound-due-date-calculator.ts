// Auto-generated from ultrasound-due-date-calculator-schema.json
import * as z from 'zod';

export interface Ultrasound_due_date_calculatorInput {
  currentThicknessMm: number;
  minThicknessMm: number;
  corrosionRateMmPerYear: number;
  measurementConfidenceFactor: number;
  dataConfidence?: number;
}

export const Ultrasound_due_date_calculatorInputSchema = z.object({
  currentThicknessMm: z.number().default(10),
  minThicknessMm: z.number().default(5),
  corrosionRateMmPerYear: z.number().default(0.2),
  measurementConfidenceFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ultrasound_due_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.corrosionRateMmPerYear * input.measurementConfidenceFactor; results["effectiveCorrosionRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveCorrosionRate"] = 0; }
  try { const v = input.corrosionRateMmPerYear * input.measurementConfidenceFactor; results["effectiveCorrosionRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveCorrosionRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUltrasound_due_date_calculator(input: Ultrasound_due_date_calculatorInput): Ultrasound_due_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveCorrosionRate_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

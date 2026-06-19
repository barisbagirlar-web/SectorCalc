// Auto-generated from km-to-m-calculator-schema.json
import * as z from 'zod';

export interface Km_to_m_calculatorInput {
  inputKm: number;
  conversionFactor: number;
  decimalPrecision: number;
  roundingMethod: number;
  minimumValue: number;
  maximumValue: number;
  scaleFactor: number;
  dataConfidence?: number;
}

export const Km_to_m_calculatorInputSchema = z.object({
  inputKm: z.number().default(1),
  conversionFactor: z.number().default(1000),
  decimalPrecision: z.number().default(2),
  roundingMethod: z.number().default(0),
  minimumValue: z.number().default(0),
  maximumValue: z.number().default(999999),
  scaleFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Km_to_m_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.inputKm) * (input.conversionFactor) * (input.decimalPrecision) * (input.roundingMethod) * (input.minimumValue) * (input.maximumValue) * (input.scaleFactor); results["rawMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawMeters"] = 0; }
  try { const v = (input.inputKm) * (input.conversionFactor) * (input.decimalPrecision); results["rawMeters_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawMeters_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKm_to_m_calculator(input: Km_to_m_calculatorInput): Km_to_m_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawMeters_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Km_to_m_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from absorbed-dose-converter-calculator-schema.json
import * as z from 'zod';

export interface Absorbed_dose_converter_calculatorInput {
  doseGray: number;
  calibrationFactor: number;
  safetyMargin: number;
  minimalDetectionLimit: number;
}

export const Absorbed_dose_converter_calculatorInputSchema = z.object({
  doseGray: z.number().default(0),
  calibrationFactor: z.number().default(1),
  safetyMargin: z.number().default(1),
  minimalDetectionLimit: z.number().default(0.001),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Absorbed_dose_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin; results["adjustedDoseGy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedDoseGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 100; results["adjustedDoseRad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedDoseRad"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000; results["adjustedDose_mGy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedDose_mGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000000; results["adjustedDose_µGy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedDose_µGy"] = 0; }
  try { const v = input.doseGray / input.minimalDetectionLimit; results["signalToNoiseRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["signalToNoiseRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAbsorbed_dose_converter_calculator(input: Absorbed_dose_converter_calculatorInput): Absorbed_dose_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedDoseGy"]);
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


export interface Absorbed_dose_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

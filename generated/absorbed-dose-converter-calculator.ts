// Auto-generated from absorbed-dose-converter-calculator-schema.json
import * as z from 'zod';

export interface Absorbed_dose_converter_calculatorInput {
  doseGray: number;
  calibrationFactor: number;
  safetyMargin: number;
  minimalDetectionLimit: number;
  dataConfidence?: number;
}

export const Absorbed_dose_converter_calculatorInputSchema = z.object({
  doseGray: z.number().default(0),
  calibrationFactor: z.number().default(1),
  safetyMargin: z.number().default(1),
  minimalDetectionLimit: z.number().default(0.001),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Absorbed_dose_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin; results["adjustedDoseGy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedDoseGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 100; results["adjustedDoseRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedDoseRad"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000; results["adjustedDose_mGy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedDose_mGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000000; results["adjustedDose_µGy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedDose_µGy"] = 0; }
  try { const v = input.doseGray / input.minimalDetectionLimit; results["signalToNoiseRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["signalToNoiseRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAbsorbed_dose_converter_calculator(input: Absorbed_dose_converter_calculatorInput): Absorbed_dose_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["adjustedDoseGy"]));
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


export interface Absorbed_dose_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

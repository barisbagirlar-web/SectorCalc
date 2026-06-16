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

function evaluateAllFormulas(input: Absorbed_dose_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin; results["adjustedDoseGy"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedDoseGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 100; results["adjustedDoseRad"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedDoseRad"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000; results["adjustedDose_mGy"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedDose_mGy"] = 0; }
  try { const v = input.doseGray * input.calibrationFactor * input.safetyMargin * 1000000; results["adjustedDose_µGy"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedDose_µGy"] = 0; }
  try { const v = input.doseGray / input.minimalDetectionLimit; results["signalToNoiseRatio"] = Number.isFinite(v) ? v : 0; } catch { results["signalToNoiseRatio"] = 0; }
  return results;
}


export function calculateAbsorbed_dose_converter_calculator(input: Absorbed_dose_converter_calculatorInput): Absorbed_dose_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedDoseGy"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

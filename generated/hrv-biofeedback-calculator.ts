// Auto-generated from hrv-biofeedback-calculator-schema.json
import * as z from 'zod';

export interface Hrv_biofeedback_calculatorInput {
  breathingRate: number;
  heartRate: number;
  hrvRMSSD: number;
  hrvSDNN: number;
  sessionDuration: number;
  age: number;
  dataConfidence?: number;
}

export const Hrv_biofeedback_calculatorInputSchema = z.object({
  breathingRate: z.number().default(6),
  heartRate: z.number().default(70),
  hrvRMSSD: z.number().default(30),
  hrvSDNN: z.number().default(50),
  sessionDuration: z.number().default(10),
  age: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hrv_biofeedback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 220 - input.age; results["maximumHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maximumHeartRate"] = Number.NaN; }
  try { const v = input.hrvRMSSD * 0.5 + input.hrvSDNN * 0.5; results["coherenceAmplitude"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coherenceAmplitude"] = Number.NaN; }
  try { const v = input.sessionDuration / 10; results["sessionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sessionFactor"] = Number.NaN; }
  return results;
}


export function calculateHrv_biofeedback_calculator(input: Hrv_biofeedback_calculatorInput): Hrv_biofeedback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maximumHeartRate"]);
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


export interface Hrv_biofeedback_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

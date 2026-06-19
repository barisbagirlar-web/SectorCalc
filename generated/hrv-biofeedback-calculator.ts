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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hrv_biofeedback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 220 - input.age; results["maximumHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maximumHeartRate"] = 0; }
  try { const v = 220 - input.age; results["maximumHeartRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maximumHeartRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHrv_biofeedback_calculator(input: Hrv_biofeedback_calculatorInput): Hrv_biofeedback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maximumHeartRate_aux"]);
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

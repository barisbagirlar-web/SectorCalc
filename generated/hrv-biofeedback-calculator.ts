// Auto-generated from hrv-biofeedback-calculator-schema.json
import * as z from 'zod';

export interface Hrv_biofeedback_calculatorInput {
  breathingRate: number;
  heartRate: number;
  hrvRMSSD: number;
  hrvSDNN: number;
  sessionDuration: number;
  age: number;
}

export const Hrv_biofeedback_calculatorInputSchema = z.object({
  breathingRate: z.number().default(6),
  heartRate: z.number().default(70),
  hrvRMSSD: z.number().default(30),
  hrvSDNN: z.number().default(50),
  sessionDuration: z.number().default(10),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Hrv_biofeedback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 6; results["resonanceBreathingRate"] = Number.isFinite(v) ? v : 0; } catch { results["resonanceBreathingRate"] = 0; }
  try { const v = Math.max(0, Math.min(100, 100 - Math.abs(input.breathingRate - 6) * 10)); results["breathingMatch"] = Number.isFinite(v) ? v : 0; } catch { results["breathingMatch"] = 0; }
  try { const v = Math.min(100, (input.hrvRMSSD / 50) * 100); results["coherenceAmplitude"] = Number.isFinite(v) ? v : 0; } catch { results["coherenceAmplitude"] = 0; }
  try { const v = Math.min(input.sessionDuration / 20, 1); results["sessionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["sessionFactor"] = 0; }
  try { const v = (((results["breathingMatch"] ?? 0) + (results["coherenceAmplitude"] ?? 0)) / 2) * (results["sessionFactor"] ?? 0); results["coherenceScore"] = Number.isFinite(v) ? v : 0; } catch { results["coherenceScore"] = 0; }
  try { const v = 220 - input.age; results["maximumHeartRate"] = Number.isFinite(v) ? v : 0; } catch { results["maximumHeartRate"] = 0; }
  try { const v = 0.1; results["resonanceFrequencyEstimate"] = Number.isFinite(v) ? v : 0; } catch { results["resonanceFrequencyEstimate"] = 0; }
  return results;
}


export function calculateHrv_biofeedback_calculator(input: Hrv_biofeedback_calculatorInput): Hrv_biofeedback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["coherenceScore"] ?? 0;
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


export interface Hrv_biofeedback_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

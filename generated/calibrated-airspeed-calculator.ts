// Auto-generated from calibrated-airspeed-calculator-schema.json
import * as z from 'zod';

export interface Calibrated_airspeed_calculatorInput {
  totalPressure: number;
  staticPressure: number;
  referencePressure: number;
  airDensity: number;
  gamma: number;
}

export const Calibrated_airspeed_calculatorInputSchema = z.object({
  totalPressure: z.number().default(101325),
  staticPressure: z.number().default(101325),
  referencePressure: z.number().default(101325),
  airDensity: z.number().default(1.225),
  gamma: z.number().default(1.4),
});

function evaluateAllFormulas(input: Calibrated_airspeed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt( (2 * input.gamma / (input.gamma - 1)) * (input.referencePressure / input.airDensity) * ( Math.pow( (Math.max(input.totalPressure - input.staticPressure, 0) / input.referencePressure + 1), ((input.gamma - 1) / input.gamma) ) - 1 ) ); results["CAS_mps"] = Number.isFinite(v) ? v : 0; } catch { results["CAS_mps"] = 0; }
  try { const v = Math.sqrt( (2 * input.gamma / (input.gamma - 1)) * (input.referencePressure / input.airDensity) * ( Math.pow( (Math.max(input.totalPressure - input.staticPressure, 0) / input.referencePressure + 1), ((input.gamma - 1) / input.gamma) ) - 1 ) ) * 1.94384; results["CAS_kts"] = Number.isFinite(v) ? v : 0; } catch { results["CAS_kts"] = 0; }
  try { const v = Math.sqrt( (2 * input.gamma / (input.gamma - 1)) * (input.referencePressure / input.airDensity) * ( Math.pow( (Math.max(input.totalPressure - input.staticPressure, 0) / input.referencePressure + 1), ((input.gamma - 1) / input.gamma) ) - 1 ) ) * 3.6; results["CAS_kmh"] = Number.isFinite(v) ? v : 0; } catch { results["CAS_kmh"] = 0; }
  return results;
}


export function calculateCalibrated_airspeed_calculator(input: Calibrated_airspeed_calculatorInput): Calibrated_airspeed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["CAS_kts"] ?? 0;
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


export interface Calibrated_airspeed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from calibrated-airspeed-calculator-schema.json
import * as z from 'zod';

export interface Calibrated_airspeed_calculatorInput {
  totalPressure: number;
  staticPressure: number;
  referencePressure: number;
  airDensity: number;
  gamma: number;
  dataConfidence?: number;
}

export const Calibrated_airspeed_calculatorInputSchema = z.object({
  totalPressure: z.number().default(101325),
  staticPressure: z.number().default(101325),
  referencePressure: z.number().default(101325),
  airDensity: z.number().default(1.225),
  gamma: z.number().default(1.4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Calibrated_airspeed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalPressure * input.staticPressure * input.referencePressure * input.airDensity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalPressure * input.staticPressure * input.referencePressure * input.airDensity * (input.gamma); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gamma; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCalibrated_airspeed_calculator(input: Calibrated_airspeed_calculatorInput): Calibrated_airspeed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Calibrated_airspeed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

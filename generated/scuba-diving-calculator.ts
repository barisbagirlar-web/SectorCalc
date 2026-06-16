// Auto-generated from scuba-diving-calculator-schema.json
import * as z from 'zod';

export interface Scuba_diving_calculatorInput {
  tankVolume: number;
  startPressure: number;
  reservePressure: number;
  diveDepth: number;
  sacRate: number;
  waterDensity: number;
}

export const Scuba_diving_calculatorInputSchema = z.object({
  tankVolume: z.number().default(12),
  startPressure: z.number().default(200),
  reservePressure: z.number().default(50),
  diveDepth: z.number().default(18),
  sacRate: z.number().default(20),
  waterDensity: z.number().default(1.03),
});

function evaluateAllFormulas(input: Scuba_diving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.diveDepth / 10) * input.waterDensity; results["ambientPressure"] = Number.isFinite(v) ? v : 0; } catch { results["ambientPressure"] = 0; }
  try { const v = (input.startPressure - input.reservePressure) * input.tankVolume; results["totalGas"] = Number.isFinite(v) ? v : 0; } catch { results["totalGas"] = 0; }
  try { const v = input.sacRate * (results["ambientPressure"] ?? 0); results["breathingRateDepth"] = Number.isFinite(v) ? v : 0; } catch { results["breathingRateDepth"] = 0; }
  try { const v = (results["totalGas"] ?? 0) / (results["breathingRateDepth"] ?? 0); results["maxDiveTime"] = Number.isFinite(v) ? v : 0; } catch { results["maxDiveTime"] = 0; }
  return results;
}


export function calculateScuba_diving_calculator(input: Scuba_diving_calculatorInput): Scuba_diving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxDiveTime"] ?? 0;
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


export interface Scuba_diving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

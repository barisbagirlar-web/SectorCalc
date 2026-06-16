// Auto-generated from pascal-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Pascal_to_psi_calculatorInput {
  pressurePascals: number;
  calibrationFactor: number;
  sensorMaxPa: number;
  sensorAccuracyClass: number;
  outputDecimals: number;
}

export const Pascal_to_psi_calculatorInputSchema = z.object({
  pressurePascals: z.number().default(101325),
  calibrationFactor: z.number().default(1),
  sensorMaxPa: z.number().default(100000),
  sensorAccuracyClass: z.number().default(0.5),
  outputDecimals: z.number().default(4),
});

function evaluateAllFormulas(input: Pascal_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressurePascals / 6894.76 * input.calibrationFactor; results["rawPsi"] = Number.isFinite(v) ? v : 0; } catch { results["rawPsi"] = 0; }
  try { const v = (input.sensorMaxPa * input.sensorAccuracyClass / 100) / 6894.76; results["uncertaintyPsi"] = Number.isFinite(v) ? v : 0; } catch { results["uncertaintyPsi"] = 0; }
  try { const v = (results["rawPsi"] ?? 0) !== 0 ? ((results["uncertaintyPsi"] ?? 0) / (results["rawPsi"] ?? 0)) * 100 : 0; results["relativeUncertaintyPercent"] = Number.isFinite(v) ? v : 0; } catch { results["relativeUncertaintyPercent"] = 0; }
  try { const v = Math.round((results["rawPsi"] ?? 0) * Math.pow(10, input.outputDecimals)) / Math.pow(10, input.outputDecimals); results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  return results;
}


export function calculatePascal_to_psi_calculator(input: Pascal_to_psi_calculatorInput): Pascal_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
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


export interface Pascal_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

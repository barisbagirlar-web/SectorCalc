// Auto-generated from mbps-to-gbps-calculator-schema.json
import * as z from 'zod';

export interface Mbps_to_gbps_calculatorInput {
  mbpsValue: number;
  conversionFactor: number;
  decimalPrecision: number;
  calibrationOffset: number;
  measurementId: number;
}

export const Mbps_to_gbps_calculatorInputSchema = z.object({
  mbpsValue: z.number().default(1000),
  conversionFactor: z.number().default(1000),
  decimalPrecision: z.number().default(2),
  calibrationOffset: z.number().default(0),
  measurementId: z.number().default(0),
});

function evaluateAllFormulas(input: Mbps_to_gbps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mbpsValue + input.calibrationOffset; results["adjustedMbps"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedMbps"] = 0; }
  try { const v = (input.mbpsValue + input.calibrationOffset) / input.conversionFactor; results["rawGbps"] = Number.isFinite(v) ? v : 0; } catch { results["rawGbps"] = 0; }
  try { const v = Math.round(((input.mbpsValue + input.calibrationOffset) / input.conversionFactor) * Math.pow(10, input.decimalPrecision)) / Math.pow(10, input.decimalPrecision); results["primaryGbps"] = Number.isFinite(v) ? v : 0; } catch { results["primaryGbps"] = 0; }
  return results;
}


export function calculateMbps_to_gbps_calculator(input: Mbps_to_gbps_calculatorInput): Mbps_to_gbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryGbps"] ?? 0;
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


export interface Mbps_to_gbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

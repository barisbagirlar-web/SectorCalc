// Auto-generated from kbps-to-mbps-calculator-schema.json
import * as z from 'zod';

export interface Kbps_to_mbps_calculatorInput {
  kbps: number;
  conversionStandard: number;
  networkOverhead: number;
  precision: number;
}

export const Kbps_to_mbps_calculatorInputSchema = z.object({
  kbps: z.number().default(1024),
  conversionStandard: z.number().default(0),
  networkOverhead: z.number().default(0),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Kbps_to_mbps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kbps * (1 + input.networkOverhead / 100); results["adjustedKbps"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedKbps"] = 0; }
  try { const v = input.conversionStandard === 0 ? 1000 : 1024; results["base"] = Number.isFinite(v) ? v : 0; } catch { results["base"] = 0; }
  try { const v = (results["adjustedKbps"] ?? 0) / (results["base"] ?? 0); results["rawMbps"] = Number.isFinite(v) ? v : 0; } catch { results["rawMbps"] = 0; }
  try { const v = Math.round((results["rawMbps"] ?? 0) * 10 ** input.precision) / 10 ** input.precision; results["mbps"] = Number.isFinite(v) ? v : 0; } catch { results["mbps"] = 0; }
  return results;
}


export function calculateKbps_to_mbps_calculator(input: Kbps_to_mbps_calculatorInput): Kbps_to_mbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mbps"] ?? 0;
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


export interface Kbps_to_mbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

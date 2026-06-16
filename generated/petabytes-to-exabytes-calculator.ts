// Auto-generated from petabytes-to-exabytes-calculator-schema.json
import * as z from 'zod';

export interface Petabytes_to_exabytes_calculatorInput {
  rawPetabytes: number;
  replicationFactor: number;
  redundancyOverhead: number;
  provisioningBuffer: number;
  compressionRatio: number;
  decimalPrecision: number;
}

export const Petabytes_to_exabytes_calculatorInputSchema = z.object({
  rawPetabytes: z.number().default(100),
  replicationFactor: z.number().default(3),
  redundancyOverhead: z.number().default(30),
  provisioningBuffer: z.number().default(20),
  compressionRatio: z.number().default(2),
  decimalPrecision: z.number().default(3),
});

function evaluateAllFormulas(input: Petabytes_to_exabytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Number((input.rawPetabytes * input.replicationFactor * (1 + input.redundancyOverhead / 100) * (1 + input.provisioningBuffer / 100) / input.compressionRatio / 1000).toFixed(input.decimalPrecision)); results["effectiveEB"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveEB"] = 0; }
  try { const v = input.rawPetabytes * input.replicationFactor * (1 + input.redundancyOverhead / 100) * (1 + input.provisioningBuffer / 100); results["rawPB"] = Number.isFinite(v) ? v : 0; } catch { results["rawPB"] = 0; }
  try { const v = input.rawPetabytes * input.replicationFactor * (1 + input.redundancyOverhead / 100) * (1 + input.provisioningBuffer / 100) / input.compressionRatio; results["compressedPB"] = Number.isFinite(v) ? v : 0; } catch { results["compressedPB"] = 0; }
  try { const v = Number((input.rawPetabytes * input.replicationFactor * (1 + input.redundancyOverhead / 100) * (1 + input.provisioningBuffer / 100) / input.compressionRatio / 1000).toFixed(input.decimalPrecision)); results["finalEB"] = Number.isFinite(v) ? v : 0; } catch { results["finalEB"] = 0; }
  return results;
}


export function calculatePetabytes_to_exabytes_calculator(input: Petabytes_to_exabytes_calculatorInput): Petabytes_to_exabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveEB"] ?? 0;
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


export interface Petabytes_to_exabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

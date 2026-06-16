// Auto-generated from network-calculator-schema.json
import * as z from 'zod';

export interface Network_calculatorInput {
  ip1: number;
  ip2: number;
  ip3: number;
  ip4: number;
  cidr: number;
}

export const Network_calculatorInputSchema = z.object({
  ip1: z.number().default(192),
  ip2: z.number().default(168),
  ip3: z.number().default(1),
  ip4: z.number().default(1),
  cidr: z.number().default(24),
});

function evaluateAllFormulas(input: Network_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.ip1 << 24) | (input.ip2 << 16) | (input.ip3 << 8) | input.ip4) >>> 0; results["ipInt"] = Number.isFinite(v) ? v : 0; } catch { results["ipInt"] = 0; }
  try { const v = input.cidr === 0 ? 0 : (0xFFFFFFFF << (32 - input.cidr)) >>> 0; results["maskInt"] = Number.isFinite(v) ? v : 0; } catch { results["maskInt"] = 0; }
  try { const v = ((results["ipInt"] ?? 0) & (results["maskInt"] ?? 0)) >>> 0; results["networkInt"] = Number.isFinite(v) ? v : 0; } catch { results["networkInt"] = 0; }
  try { const v = ((results["networkInt"] ?? 0) | (~(results["maskInt"] ?? 0) >>> 0)) >>> 0; results["broadcastInt"] = Number.isFinite(v) ? v : 0; } catch { results["broadcastInt"] = 0; }
  try { const v = input.cidr >= 31 ? 0 : Math.pow(2, 32 - input.cidr) - 2; results["hostCount"] = Number.isFinite(v) ? v : 0; } catch { results["hostCount"] = 0; }
  return results;
}


export function calculateNetwork_calculator(input: Network_calculatorInput): Network_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["networkInt"] ?? 0;
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


export interface Network_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

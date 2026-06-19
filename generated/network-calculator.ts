// Auto-generated from network-calculator-schema.json
import * as z from 'zod';

export interface Network_calculatorInput {
  ip1: number;
  ip2: number;
  ip3: number;
  ip4: number;
  cidr: number;
  dataConfidence?: number;
}

export const Network_calculatorInputSchema = z.object({
  ip1: z.number().default(192),
  ip2: z.number().default(168),
  ip3: z.number().default(1),
  ip4: z.number().default(1),
  cidr: z.number().default(24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Network_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.ip1 << 24) >>> 0) + (input.ip2 << 16) + (input.ip3 << 8) + input.ip4; results["ipInt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ipInt"] = 0; }
  try { const v = input.cidr === 0 ? 0 : (4294967295 << (32 - input.cidr)) >>> 0; results["maskInt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maskInt"] = 0; }
  try { const v = input.cidr === 32 ? 1 : (1 << (32 - input.cidr)) - 2; results["hostCount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hostCount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNetwork_calculator(input: Network_calculatorInput): Network_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hostCount"]);
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


export interface Network_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

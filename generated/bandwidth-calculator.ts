// Auto-generated from bandwidth-calculator-schema.json
import * as z from 'zod';

export interface Bandwidth_calculatorInput {
  dataSize: number;
  transferTime: number;
  protocolOverhead: number;
  channels: number;
  encodingEfficiency: number;
  redundancyFactor: number;
  dataConfidence?: number;
}

export const Bandwidth_calculatorInputSchema = z.object({
  dataSize: z.number().default(1000000),
  transferTime: z.number().default(1),
  protocolOverhead: z.number().default(10),
  channels: z.number().default(1),
  encodingEfficiency: z.number().default(100),
  redundancyFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bandwidth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dataSize * (1 + input.protocolOverhead / 100) * input.redundancyFactor; results["effectiveData"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveData"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveData"])) / input.transferTime; results["requiredTotalBandwidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredTotalBandwidth"] = 0; }
  try { const v = (asFormulaNumber(results["requiredTotalBandwidth"])) / (input.channels * (input.encodingEfficiency / 100)); results["bandwidthPerChannel"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bandwidthPerChannel"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBandwidth_calculator(input: Bandwidth_calculatorInput): Bandwidth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bandwidthPerChannel"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Bandwidth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

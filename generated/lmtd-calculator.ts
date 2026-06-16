// Auto-generated from lmtd-calculator-schema.json
import * as z from 'zod';

export interface Lmtd_calculatorInput {
  thIn: number;
  thOut: number;
  tcIn: number;
  tcOut: number;
  flowType: number;
}

export const Lmtd_calculatorInputSchema = z.object({
  thIn: z.number().default(90),
  thOut: z.number().default(70),
  tcIn: z.number().default(30),
  tcOut: z.number().default(50),
  flowType: z.number().default(1),
});

function evaluateAllFormulas(input: Lmtd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowType === 1 ? (input.thIn - input.tcOut) : (input.thIn - input.tcIn); results["deltaT1"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT1"] = 0; }
  try { const v = input.flowType === 1 ? (input.thOut - input.tcIn) : (input.thOut - input.tcOut); results["deltaT2"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT2"] = 0; }
  try { const v = (Math.abs((results["deltaT1"] ?? 0) - (results["deltaT2"] ?? 0)) < 1e-10) ? (results["deltaT1"] ?? 0) : (((results["deltaT1"] ?? 0) - (results["deltaT2"] ?? 0)) / Math.log((results["deltaT1"] ?? 0) / (results["deltaT2"] ?? 0))); results["lmtd"] = Number.isFinite(v) ? v : 0; } catch { results["lmtd"] = 0; }
  return results;
}


export function calculateLmtd_calculator(input: Lmtd_calculatorInput): Lmtd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lmtd"] ?? 0;
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


export interface Lmtd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

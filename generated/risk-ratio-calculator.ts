// Auto-generated from risk-ratio-calculator-schema.json
import * as z from 'zod';

export interface Risk_ratio_calculatorInput {
  exposedEvents: number;
  exposedTotal: number;
  controlEvents: number;
  controlTotal: number;
}

export const Risk_ratio_calculatorInputSchema = z.object({
  exposedEvents: z.number().default(0),
  exposedTotal: z.number().default(0),
  controlEvents: z.number().default(0),
  controlTotal: z.number().default(0),
});

function evaluateAllFormulas(input: Risk_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exposedEvents / input.exposedTotal; results["exposedRisk"] = Number.isFinite(v) ? v : 0; } catch { results["exposedRisk"] = 0; }
  try { const v = input.controlEvents / input.controlTotal; results["controlRisk"] = Number.isFinite(v) ? v : 0; } catch { results["controlRisk"] = 0; }
  try { const v = (input.exposedEvents * input.controlTotal) / (input.exposedTotal * input.controlEvents); results["riskRatio"] = Number.isFinite(v) ? v : 0; } catch { results["riskRatio"] = 0; }
  return results;
}


export function calculateRisk_ratio_calculator(input: Risk_ratio_calculatorInput): Risk_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskRatio"] ?? 0;
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


export interface Risk_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

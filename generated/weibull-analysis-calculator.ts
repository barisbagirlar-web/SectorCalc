// Auto-generated from weibull-analysis-calculator-schema.json
import * as z from 'zod';

export interface Weibull_analysis_calculatorInput {
  shape: number;
  scale: number;
  time: number;
  location: number;
}

export const Weibull_analysis_calculatorInputSchema = z.object({
  shape: z.number().default(1),
  scale: z.number().default(100),
  time: z.number().default(100),
  location: z.number().default(0),
});

function evaluateAllFormulas(input: Weibull_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(-Math.pow(Math.max(0, input.time - input.location) / input.scale, input.shape)); results["reliability"] = Number.isFinite(v) ? v : 0; } catch { results["reliability"] = 0; }
  try { const v = 1 - (results["reliability"] ?? 0); results["failureProbability"] = Number.isFinite(v) ? v : 0; } catch { results["failureProbability"] = 0; }
  try { const v = input.time > input.location ? (input.shape / input.scale) * Math.pow((input.time - input.location) / input.scale, input.shape - 1) : 0; results["failureRate"] = Number.isFinite(v) ? v : 0; } catch { results["failureRate"] = 0; }
  try { const v = input.location + input.scale * Math.pow(-Math.log(0.9), 1 / input.shape); results["b10Life"] = Number.isFinite(v) ? v : 0; } catch { results["b10Life"] = 0; }
  return results;
}


export function calculateWeibull_analysis_calculator(input: Weibull_analysis_calculatorInput): Weibull_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["reliability"] ?? 0;
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


export interface Weibull_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

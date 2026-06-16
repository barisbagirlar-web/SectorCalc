// Auto-generated from retention-factor-calculator-schema.json
import * as z from 'zod';

export interface Retention_factor_calculatorInput {
  feedConc: number;
  permeateConc: number;
  feedFlow: number;
  permeateFlow: number;
}

export const Retention_factor_calculatorInputSchema = z.object({
  feedConc: z.number().default(100),
  permeateConc: z.number().default(10),
  feedFlow: z.number().default(10),
  permeateFlow: z.number().default(5),
});

function evaluateAllFormulas(input: Retention_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input.permeateConc / input.feedConc); results["retentionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["retentionFactor"] = 0; }
  try { const v = (input.permeateFlow / input.feedFlow) * 100; results["recoveryRate"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryRate"] = 0; }
  try { const v = ((input.feedConc * input.feedFlow) - (input.permeateConc * input.permeateFlow)) / (input.feedFlow - input.permeateFlow); results["concentrateConc"] = Number.isFinite(v) ? v : 0; } catch { results["concentrateConc"] = 0; }
  try { const v = input.feedFlow - input.permeateFlow; results["concentrateFlow"] = Number.isFinite(v) ? v : 0; } catch { results["concentrateFlow"] = 0; }
  return results;
}


export function calculateRetention_factor_calculator(input: Retention_factor_calculatorInput): Retention_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["retentionFactor"] ?? 0;
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


export interface Retention_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

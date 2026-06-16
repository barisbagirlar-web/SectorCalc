// Auto-generated from distillation-calculator-schema.json
import * as z from 'zod';

export interface Distillation_calculatorInput {
  feedFlow: number;
  feedComposition: number;
  distillateComposition: number;
  bottomsComposition: number;
  relativeVolatility: number;
}

export const Distillation_calculatorInputSchema = z.object({
  feedFlow: z.number().default(100),
  feedComposition: z.number().default(0.5),
  distillateComposition: z.number().default(0.95),
  bottomsComposition: z.number().default(0.05),
  relativeVolatility: z.number().default(2.5),
});

function evaluateAllFormulas(input: Distillation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.feedFlow * (input.feedComposition - input.bottomsComposition) / (input.distillateComposition - input.bottomsComposition); results["distillateFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["distillateFlowRate"] = 0; }
  try { const v = input.feedFlow * (input.distillateComposition - input.feedComposition) / (input.distillateComposition - input.bottomsComposition); results["bottomFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["bottomFlowRate"] = 0; }
  try { const v = (1 / (input.relativeVolatility - 1)) * ((input.distillateComposition / input.feedComposition) - input.relativeVolatility * (1 - input.distillateComposition) / (1 - input.feedComposition)); results["minimumRefluxRatio"] = Number.isFinite(v) ? v : 0; } catch { results["minimumRefluxRatio"] = 0; }
  try { const v = Math.log((input.distillateComposition / (1 - input.distillateComposition)) * ((1 - input.bottomsComposition) / input.bottomsComposition)) / Math.log(input.relativeVolatility); results["minimumTheoreticalPlates"] = Number.isFinite(v) ? v : 0; } catch { results["minimumTheoreticalPlates"] = 0; }
  return results;
}


export function calculateDistillation_calculator(input: Distillation_calculatorInput): Distillation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["distillateFlowRate"] ?? 0;
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


export interface Distillation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

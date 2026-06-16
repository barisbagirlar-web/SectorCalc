// Auto-generated from step-calculator-schema.json
import * as z from 'zod';

export interface Step_calculatorInput {
  totalHeight: number;
  stepHeight: number;
  stepDepth: number;
  landingWidth: number;
  headroom: number;
}

export const Step_calculatorInputSchema = z.object({
  totalHeight: z.number().default(280),
  stepHeight: z.number().default(18),
  stepDepth: z.number().default(28),
  landingWidth: z.number().default(100),
  headroom: z.number().default(210),
});

function evaluateAllFormulas(input: Step_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.totalHeight / input.stepHeight); results["numberOfSteps"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfSteps"] = 0; }
  try { const v = input.totalHeight / (results["numberOfSteps"] ?? 0); results["actualStepHeight"] = Number.isFinite(v) ? v : 0; } catch { results["actualStepHeight"] = 0; }
  try { const v = ((results["numberOfSteps"] ?? 0) - 1) * input.stepDepth; results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = (results["totalRun"] ?? 0) + input.landingWidth; results["totalLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  try { const v = input.headroom >= 210 ? 'Compliant' : 'Non-compliant'; results["headroomCompliant"] = Number.isFinite(v) ? v : 0; } catch { results["headroomCompliant"] = 0; }
  return results;
}


export function calculateStep_calculator(input: Step_calculatorInput): Step_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfSteps"] ?? 0;
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


export interface Step_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

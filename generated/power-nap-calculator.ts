// Auto-generated from power-nap-calculator-schema.json
import * as z from 'zod';

export interface Power_nap_calculatorInput {
  currentTimeMinutes: number;
  deadlineTimeMinutes: number;
  sleepLatencyMinutes: number;
  napQualityGoal: number;
}

export const Power_nap_calculatorInputSchema = z.object({
  currentTimeMinutes: z.number().default(480),
  deadlineTimeMinutes: z.number().default(720),
  sleepLatencyMinutes: z.number().default(10),
  napQualityGoal: z.number().default(5),
});

function evaluateAllFormulas(input: Power_nap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deadlineTimeMinutes - input.currentTimeMinutes; results["availableTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["availableTimeMinutes"] = 0; }
  try { const v = ((results["availableTimeMinutes"] ?? 0) >= (20 + input.sleepLatencyMinutes)) && ((results["availableTimeMinutes"] ?? 0) > 0); results["powerNapFeasible"] = Number.isFinite(v) ? v : 0; } catch { results["powerNapFeasible"] = 0; }
  try { const v = (results["availableTimeMinutes"] ?? 0) >= (90 + input.sleepLatencyMinutes); results["fullCycleFeasible"] = Number.isFinite(v) ? v : 0; } catch { results["fullCycleFeasible"] = 0; }
  try { const v = (results["fullCycleFeasible"] ?? 0) && input.napQualityGoal >= 5 ? 90 : ((results["powerNapFeasible"] ?? 0) ? 20 : 0); results["recommendedNapDuration"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedNapDuration"] = 0; }
  return results;
}


export function calculatePower_nap_calculator(input: Power_nap_calculatorInput): Power_nap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedNapDuration"] ?? 0;
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


export interface Power_nap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

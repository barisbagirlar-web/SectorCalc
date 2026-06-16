// Auto-generated from activity-calculator-schema.json
import * as z from 'zod';

export interface Activity_calculatorInput {
  actualOutput: number;
  plannedOutput: number;
  availableTime: number;
  downtime: number;
  cycleTime: number;
}

export const Activity_calculatorInputSchema = z.object({
  actualOutput: z.number().default(0),
  plannedOutput: z.number().default(0),
  availableTime: z.number().default(0),
  downtime: z.number().default(0),
  cycleTime: z.number().default(0),
});

function evaluateAllFormulas(input: Activity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.availableTime - input.downtime; results["actualProductionTime"] = Number.isFinite(v) ? v : 0; } catch { results["actualProductionTime"] = 0; }
  try { const v = input.actualOutput / (results["actualProductionTime"] ?? 0); results["activityRate"] = Number.isFinite(v) ? v : 0; } catch { results["activityRate"] = 0; }
  try { const v = input.actualOutput / input.plannedOutput; results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = (results["actualProductionTime"] ?? 0) / input.availableTime; results["utilization"] = Number.isFinite(v) ? v : 0; } catch { results["utilization"] = 0; }
  try { const v = (input.availableTime * 3600) / input.cycleTime; results["theoreticalMaxOutput"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalMaxOutput"] = 0; }
  try { const v = input.actualOutput / (results["theoreticalMaxOutput"] ?? 0); results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  return results;
}


export function calculateActivity_calculator(input: Activity_calculatorInput): Activity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["activityRate"] ?? 0;
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


export interface Activity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

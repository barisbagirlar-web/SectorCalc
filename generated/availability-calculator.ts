// Auto-generated from availability-calculator-schema.json
import * as z from 'zod';

export interface Availability_calculatorInput {
  plannedAvailableTime: number;
  unplannedDowntime: number;
  plannedDowntime: number;
  numberOfFailures: number;
  meanTimeToRepair: number;
}

export const Availability_calculatorInputSchema = z.object({
  plannedAvailableTime: z.number().default(480),
  unplannedDowntime: z.number().default(30),
  plannedDowntime: z.number().default(20),
  numberOfFailures: z.number().default(2),
  meanTimeToRepair: z.number().default(15),
});

function evaluateAllFormulas(input: Availability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unplannedDowntime + input.plannedDowntime; results["totalDowntime"] = Number.isFinite(v) ? v : 0; } catch { results["totalDowntime"] = 0; }
  try { const v = input.plannedAvailableTime - (input.unplannedDowntime + input.plannedDowntime); results["uptime"] = Number.isFinite(v) ? v : 0; } catch { results["uptime"] = 0; }
  try { const v = (input.plannedAvailableTime - input.unplannedDowntime - input.plannedDowntime) / input.plannedAvailableTime * 100; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.plannedAvailableTime - input.unplannedDowntime - input.plannedDowntime) / input.numberOfFailures; results["mtbf"] = Number.isFinite(v) ? v : 0; } catch { results["mtbf"] = 0; }
  try { const v = input.meanTimeToRepair; results["mttr"] = Number.isFinite(v) ? v : 0; } catch { results["mttr"] = 0; }
  return results;
}


export function calculateAvailability_calculator(input: Availability_calculatorInput): Availability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["availability"] ?? 0;
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


export interface Availability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

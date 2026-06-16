// Auto-generated from capacity-analysis-calculator-schema.json
import * as z from 'zod';

export interface Capacity_analysis_calculatorInput {
  numMachines: number;
  hoursPerDay: number;
  daysPerMonth: number;
  efficiency: number;
  productDemand: number;
  cycleTime: number;
}

export const Capacity_analysis_calculatorInputSchema = z.object({
  numMachines: z.number().default(10),
  hoursPerDay: z.number().default(8),
  daysPerMonth: z.number().default(22),
  efficiency: z.number().default(85),
  productDemand: z.number().default(10000),
  cycleTime: z.number().default(1.5),
});

function evaluateAllFormulas(input: Capacity_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numMachines * input.hoursPerDay * 60 * input.daysPerMonth * (input.efficiency / 100) / input.cycleTime; results["availableCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["availableCapacity"] = 0; }
  try { const v = input.productDemand; results["requiredCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["requiredCapacity"] = 0; }
  try { const v = input.productDemand / (input.numMachines * input.hoursPerDay * 60 * input.daysPerMonth * (input.efficiency / 100) / input.cycleTime) * 100; results["capacityUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["capacityUtilization"] = 0; }
  try { const v = Math.ceil(input.productDemand * input.cycleTime / (input.hoursPerDay * 60 * input.daysPerMonth * (input.efficiency / 100))); results["requiredMachines"] = Number.isFinite(v) ? v : 0; } catch { results["requiredMachines"] = 0; }
  return results;
}


export function calculateCapacity_analysis_calculator(input: Capacity_analysis_calculatorInput): Capacity_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["capacityUtilization"] ?? 0;
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


export interface Capacity_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

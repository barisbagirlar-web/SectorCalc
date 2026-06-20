// Auto-generated from capacity-analysis-calculator-schema.json
import * as z from 'zod';

export interface Capacity_analysis_calculatorInput {
  numMachines: number;
  hoursPerDay: number;
  daysPerMonth: number;
  efficiency: number;
  productDemand: number;
  cycleTime: number;
  dataConfidence?: number;
}

export const Capacity_analysis_calculatorInputSchema = z.object({
  numMachines: z.number().default(10),
  hoursPerDay: z.number().default(8),
  daysPerMonth: z.number().default(22),
  efficiency: z.number().default(85),
  productDemand: z.number().default(10000),
  cycleTime: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Capacity_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numMachines * input.hoursPerDay * 60 * input.daysPerMonth * (input.efficiency / 100) / input.cycleTime; results["availableCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availableCapacity"] = Number.NaN; }
  try { const v = input.productDemand; results["requiredCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredCapacity"] = Number.NaN; }
  try { const v = input.productDemand / (input.numMachines * input.hoursPerDay * 60 * input.daysPerMonth * (input.efficiency / 100) / input.cycleTime) * 100; results["capacityUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capacityUtilization"] = Number.NaN; }
  return results;
}


export function calculateCapacity_analysis_calculator(input: Capacity_analysis_calculatorInput): Capacity_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capacityUtilization"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

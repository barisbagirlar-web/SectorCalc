// Auto-generated from mttr-calculator-schema.json
import * as z from 'zod';

export interface Mttr_calculatorInput {
  repairTime: number;
  adminDelay: number;
  logisticsDelay: number;
  numberOfRepairs: number;
}

export const Mttr_calculatorInputSchema = z.object({
  repairTime: z.number().default(10),
  adminDelay: z.number().default(2),
  logisticsDelay: z.number().default(1),
  numberOfRepairs: z.number().default(5),
});

function evaluateAllFormulas(input: Mttr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.repairTime + input.adminDelay + input.logisticsDelay) / input.numberOfRepairs; results["mttr"] = Number.isFinite(v) ? v : 0; } catch { results["mttr"] = 0; }
  try { const v = input.repairTime + input.adminDelay + input.logisticsDelay; results["totalDowntime"] = Number.isFinite(v) ? v : 0; } catch { results["totalDowntime"] = 0; }
  try { const v = input.numberOfRepairs; results["numberOfRepairs"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfRepairs"] = 0; }
  return results;
}


export function calculateMttr_calculator(input: Mttr_calculatorInput): Mttr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mttr"] ?? 0;
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


export interface Mttr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

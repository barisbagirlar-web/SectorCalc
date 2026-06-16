// Auto-generated from eoq-calculator-schema.json
import * as z from 'zod';

export interface Eoq_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTimeDays: number;
  workingDaysPerYear: number;
}

export const Eoq_calculatorInputSchema = z.object({
  annualDemand: z.number().default(10000),
  orderingCost: z.number().default(100),
  holdingCost: z.number().default(5),
  unitCost: z.number().default(0),
  leadTimeDays: z.number().default(5),
  workingDaysPerYear: z.number().default(250),
});

function evaluateAllFormulas(input: Eoq_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCost); results["eoq"] = Number.isFinite(v) ? v : 0; } catch { results["eoq"] = 0; }
  try { const v = (input.annualDemand / (results["eoq"] ?? 0)) * input.orderingCost; results["totalOrderingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalOrderingCost"] = 0; }
  try { const v = ((results["eoq"] ?? 0) / 2) * input.holdingCost; results["totalHoldingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalHoldingCost"] = 0; }
  try { const v = (input.annualDemand / (results["eoq"] ?? 0)) * input.orderingCost + ((results["eoq"] ?? 0) / 2) * input.holdingCost + input.annualDemand * input.unitCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays; results["reorderPoint"] = Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  return results;
}


export function calculateEoq_calculator(input: Eoq_calculatorInput): Eoq_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eoq"] ?? 0;
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


export interface Eoq_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

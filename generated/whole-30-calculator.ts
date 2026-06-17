// Auto-generated from whole-30-calculator-schema.json
import * as z from 'zod';

export interface Whole_30_calculatorInput {
  dailyDemand: number;
  costPerKg: number;
  wasteRate: number;
  days: number;
}

export const Whole_30_calculatorInputSchema = z.object({
  dailyDemand: z.number().default(100),
  costPerKg: z.number().default(2.5),
  wasteRate: z.number().default(5),
  days: z.number().default(30),
});

function evaluateAllFormulas(input: Whole_30_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100); results["totalMaterial"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterial"] = 0; }
  try { const v = input.dailyDemand * input.days * input.wasteRate / 100; results["wasteAmount"] = Number.isFinite(v) ? v : 0; } catch { results["wasteAmount"] = 0; }
  try { const v = input.dailyDemand * input.days * (1 + input.wasteRate/100) * input.costPerKg; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.dailyDemand * input.days * (input.wasteRate/100) * input.costPerKg; results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  return results;
}


export function calculateWhole_30_calculator(input: Whole_30_calculatorInput): Whole_30_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Whole_30_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

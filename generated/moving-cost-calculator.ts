// Auto-generated from moving-cost-calculator-schema.json
import * as z from 'zod';

export interface Moving_cost_calculatorInput {
  distance: number;
  weight: number;
  laborHours: number;
  packingItems: number;
  ratePerKm: number;
  ratePerKg: number;
  hourlyRate: number;
  packingCostPerItem: number;
  dataConfidence?: number;
}

export const Moving_cost_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  weight: z.number().default(1000),
  laborHours: z.number().default(8),
  packingItems: z.number().default(20),
  ratePerKm: z.number().default(0.5),
  ratePerKg: z.number().default(0.2),
  hourlyRate: z.number().default(25),
  packingCostPerItem: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Moving_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.ratePerKm + input.weight * input.ratePerKg; results["transportCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transportCost"] = Number.NaN; }
  try { const v = input.laborHours * input.hourlyRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = input.packingItems * input.packingCostPerItem; results["packingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["packingCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["transportCost"])) + (toNumericFormulaValue(results["laborCost"])) + (toNumericFormulaValue(results["packingCost"])); results["totalMovingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMovingCost"] = Number.NaN; }
  return results;
}


export function calculateMoving_cost_calculator(input: Moving_cost_calculatorInput): Moving_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMovingCost"]);
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


export interface Moving_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

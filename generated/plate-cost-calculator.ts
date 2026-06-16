// Auto-generated from plate-cost-calculator-schema.json
import * as z from 'zod';

export interface Plate_cost_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  density: number;
  costPerKg: number;
  overheadPercent: number;
  wastePercent: number;
}

export const Plate_cost_calculatorInputSchema = z.object({
  length: z.number().default(1000),
  width: z.number().default(500),
  thickness: z.number().default(10),
  density: z.number().default(7850),
  costPerKg: z.number().default(2.5),
  overheadPercent: z.number().default(20),
  wastePercent: z.number().default(5),
});

function evaluateAllFormulas(input: Plate_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.length * input.width * input.thickness / 1e9) * input.density * input.costPerKg; results["rawMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["rawMaterialCost"] = 0; }
  try { const v = (results["rawMaterialCost"] ?? 0) * (1 + input.wastePercent / 100); results["materialCostWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostWithWaste"] = 0; }
  try { const v = (results["materialCostWithWaste"] ?? 0) * (input.overheadPercent / 100); results["overheadAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (results["materialCostWithWaste"] ?? 0) + (results["overheadAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculatePlate_cost_calculator(input: Plate_cost_calculatorInput): Plate_cost_calculatorOutput {
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


export interface Plate_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

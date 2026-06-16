// Auto-generated from baccarat-calculator-schema.json
import * as z from 'zod';

export interface Baccarat_calculatorInput {
  rawMaterialCost: number;
  laborCostPerHour: number;
  hoursPerUnit: number;
  energyCostPerUnit: number;
  additionalCost: number;
  overheadRate: number;
  profitMargin: number;
}

export const Baccarat_calculatorInputSchema = z.object({
  rawMaterialCost: z.number().default(10),
  laborCostPerHour: z.number().default(50),
  hoursPerUnit: z.number().default(0.5),
  energyCostPerUnit: z.number().default(2),
  additionalCost: z.number().default(5),
  overheadRate: z.number().default(20),
  profitMargin: z.number().default(30),
});

function evaluateAllFormulas(input: Baccarat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialCost + input.laborCostPerHour * input.hoursPerUnit + input.energyCostPerUnit; results["directCosts"] = Number.isFinite(v) ? v : 0; } catch { results["directCosts"] = 0; }
  try { const v = (results["directCosts"] ?? 0) * input.overheadRate / 100; results["overheadAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (results["directCosts"] ?? 0) + input.additionalCost + (results["overheadAmount"] ?? 0); results["totalProductionCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalProductionCost"] = 0; }
  try { const v = (results["totalProductionCost"] ?? 0) * input.profitMargin / 100; results["profitAmount"] = Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (results["totalProductionCost"] ?? 0) + (results["profitAmount"] ?? 0); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


export function calculateBaccarat_calculator(input: Baccarat_calculatorInput): Baccarat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPrice"] ?? 0;
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


export interface Baccarat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

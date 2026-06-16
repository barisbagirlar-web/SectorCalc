// Auto-generated from warehouse-calculator-schema.json
import * as z from 'zod';

export interface Warehouse_calculatorInput {
  totalArea: number;
  storageArea: number;
  maxPalletPositions: number;
  currentPallets: number;
  dailyThroughput: number;
  operatingDays: number;
  annualFixedCost: number;
  variableCostPerPallet: number;
}

export const Warehouse_calculatorInputSchema = z.object({
  totalArea: z.number().default(1000),
  storageArea: z.number().default(800),
  maxPalletPositions: z.number().default(500),
  currentPallets: z.number().default(300),
  dailyThroughput: z.number().default(100),
  operatingDays: z.number().default(250),
  annualFixedCost: z.number().default(100000),
  variableCostPerPallet: z.number().default(10),
});

function evaluateAllFormulas(input: Warehouse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyThroughput * input.operatingDays; results["annualVolume"] = Number.isFinite(v) ? v : 0; } catch { results["annualVolume"] = 0; }
  try { const v = input.annualFixedCost + input.variableCostPerPallet * (results["annualVolume"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (results["annualVolume"] ?? 0); results["costPerPallet"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPallet"] = 0; }
  try { const v = (input.storageArea / input.totalArea) * 100; results["spaceUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["spaceUtilization"] = 0; }
  try { const v = (input.currentPallets / input.maxPalletPositions) * 100; results["capacityUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["capacityUtilization"] = 0; }
  return results;
}


export function calculateWarehouse_calculator(input: Warehouse_calculatorInput): Warehouse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerPallet"] ?? 0;
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


export interface Warehouse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

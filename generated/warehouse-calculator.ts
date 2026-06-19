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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Warehouse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyThroughput * input.operatingDays; results["annualVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualVolume"] = 0; }
  try { const v = (input.storageArea / input.totalArea) * 100; results["spaceUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["spaceUtilization"] = 0; }
  try { const v = (input.currentPallets / input.maxPalletPositions) * 100; results["capacityUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["capacityUtilization"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWarehouse_calculator(input: Warehouse_calculatorInput): Warehouse_calculatorOutput {
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


export interface Warehouse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

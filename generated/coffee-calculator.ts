// Auto-generated from coffee-calculator-schema.json
import * as z from 'zod';

export interface Coffee_calculatorInput {
  coffeeBeans: number;
  waterAmount: number;
  beanCostPerKg: number;
  electricityCostPerKwh: number;
  machinePowerWatts: number;
  brewTimeMinutes: number;
  laborCostPerHour: number;
  overheadFactor: number;
}

export const Coffee_calculatorInputSchema = z.object({
  coffeeBeans: z.number().default(15),
  waterAmount: z.number().default(250),
  beanCostPerKg: z.number().default(20),
  electricityCostPerKwh: z.number().default(0.15),
  machinePowerWatts: z.number().default(1000),
  brewTimeMinutes: z.number().default(3),
  laborCostPerHour: z.number().default(12),
  overheadFactor: z.number().default(15),
});

function evaluateAllFormulas(input: Coffee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.coffeeBeans / 1000) * input.beanCostPerKg; results["coffeeCost"] = Number.isFinite(v) ? v : 0; } catch { results["coffeeCost"] = 0; }
  try { const v = ((input.machinePowerWatts * (input.brewTimeMinutes / 60)) / 1000) * input.electricityCostPerKwh; results["energyCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = (input.brewTimeMinutes / 60) * input.laborCostPerHour; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["coffeeCost"] ?? 0) + (results["energyCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalDirectCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) * (1 + (input.overheadFactor / 100)); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateCoffee_calculator(input: Coffee_calculatorInput): Coffee_calculatorOutput {
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


export interface Coffee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

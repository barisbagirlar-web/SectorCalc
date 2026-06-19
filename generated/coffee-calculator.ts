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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Coffee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.coffeeBeans / 1000) * input.beanCostPerKg; results["coffeeCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coffeeCost"] = 0; }
  try { const v = ((input.machinePowerWatts * (input.brewTimeMinutes / 60)) / 1000) * input.electricityCostPerKwh; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = (input.brewTimeMinutes / 60) * input.laborCostPerHour; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["coffeeCost"])) + (asFormulaNumber(results["energyCost"])) + (asFormulaNumber(results["laborCost"])); results["totalDirectCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) * (1 + (input.overheadFactor / 100)); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCoffee_calculator(input: Coffee_calculatorInput): Coffee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

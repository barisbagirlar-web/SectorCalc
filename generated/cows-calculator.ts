// Auto-generated from cows-calculator-schema.json
import * as z from 'zod';

export interface Cows_calculatorInput {
  downtimeHours: number;
  affectedMachines: number;
  hourlyCostPerMachine: number;
  lostProductionPerHour: number;
  profitPerUnit: number;
  overheadMultiplier: number;
  dataConfidence?: number;
}

export const Cows_calculatorInputSchema = z.object({
  downtimeHours: z.number().default(1),
  affectedMachines: z.number().default(1),
  hourlyCostPerMachine: z.number().default(100),
  lostProductionPerHour: z.number().default(10),
  profitPerUnit: z.number().default(20),
  overheadMultiplier: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cows_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.downtimeHours * input.affectedMachines * input.hourlyCostPerMachine; results["directCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directCost"] = Number.NaN; }
  try { const v = input.downtimeHours * input.affectedMachines * input.lostProductionPerHour * input.profitPerUnit; results["lostProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lostProfit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["directCost"])) + (toNumericFormulaValue(results["lostProfit"]))) * input.overheadMultiplier; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateCows_calculator(input: Cows_calculatorInput): Cows_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Cows_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

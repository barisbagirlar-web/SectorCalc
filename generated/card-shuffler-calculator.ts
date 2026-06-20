// Auto-generated from card-shuffler-calculator-schema.json
import * as z from 'zod';

export interface Card_shuffler_calculatorInput {
  cardsPerDeck: number;
  shuffleCycles: number;
  machineSpeed: number;
  powerRating: number;
  operatingHours: number;
  maintenanceHours: number;
  laborCost: number;
  electricityCost: number;
  dataConfidence?: number;
}

export const Card_shuffler_calculatorInputSchema = z.object({
  cardsPerDeck: z.number().default(52),
  shuffleCycles: z.number().default(7),
  machineSpeed: z.number().default(100),
  powerRating: z.number().default(0.5),
  operatingHours: z.number().default(8),
  maintenanceHours: z.number().default(0.5),
  laborCost: z.number().default(20),
  electricityCost: z.number().default(0.12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Card_shuffler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.operatingHours - input.maintenanceHours) * 60; results["effectiveMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMinutes"] = Number.NaN; }
  try { const v = input.machineSpeed * (toNumericFormulaValue(results["effectiveMinutes"])); results["totalCardsPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCardsPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCardsPerDay"])) / (input.cardsPerDeck * input.shuffleCycles); results["packsPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["packsPerDay"] = Number.NaN; }
  try { const v = input.powerRating * (input.operatingHours - input.maintenanceHours); results["energyConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyConsumption"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyConsumption"])) * input.electricityCost; results["energyCostPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCostPerDay"] = Number.NaN; }
  try { const v = input.laborCost * input.operatingHours; results["laborCostPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyCostPerDay"])) + (toNumericFormulaValue(results["laborCostPerDay"])); results["totalDailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDailyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDailyCost"])) / (toNumericFormulaValue(results["packsPerDay"])); results["costPerPack"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerPack"] = Number.NaN; }
  try { const v = ((input.operatingHours - input.maintenanceHours) / input.operatingHours) * 100; results["machineUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machineUtilization"] = Number.NaN; }
  return results;
}


export function calculateCard_shuffler_calculator(input: Card_shuffler_calculatorInput): Card_shuffler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["packsPerDay"]);
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


export interface Card_shuffler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

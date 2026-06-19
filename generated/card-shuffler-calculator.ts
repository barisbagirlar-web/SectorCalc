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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Card_shuffler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.operatingHours - input.maintenanceHours) * 60; results["effectiveMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveMinutes"] = 0; }
  try { const v = input.machineSpeed * (asFormulaNumber(results["effectiveMinutes"])); results["totalCardsPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCardsPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["totalCardsPerDay"])) / (input.cardsPerDeck * input.shuffleCycles); results["packsPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["packsPerDay"] = 0; }
  try { const v = input.powerRating * (input.operatingHours - input.maintenanceHours); results["energyConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyConsumption"] = 0; }
  try { const v = (asFormulaNumber(results["energyConsumption"])) * input.electricityCost; results["energyCostPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyCostPerDay"] = 0; }
  try { const v = input.laborCost * input.operatingHours; results["laborCostPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCostPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["energyCostPerDay"])) + (asFormulaNumber(results["laborCostPerDay"])); results["totalDailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDailyCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDailyCost"])) / (asFormulaNumber(results["packsPerDay"])); results["costPerPack"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerPack"] = 0; }
  try { const v = ((input.operatingHours - input.maintenanceHours) / input.operatingHours) * 100; results["machineUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["machineUtilization"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCard_shuffler_calculator(input: Card_shuffler_calculatorInput): Card_shuffler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["packsPerDay"]));
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


export interface Card_shuffler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

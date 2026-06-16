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

function evaluateAllFormulas(input: Card_shuffler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.operatingHours - input.maintenanceHours) * 60; results["effectiveMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveMinutes"] = 0; }
  try { const v = input.machineSpeed * (results["effectiveMinutes"] ?? 0); results["totalCardsPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["totalCardsPerDay"] = 0; }
  try { const v = (results["totalCardsPerDay"] ?? 0) / (input.cardsPerDeck * input.shuffleCycles); results["packsPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["packsPerDay"] = 0; }
  try { const v = input.powerRating * (input.operatingHours - input.maintenanceHours); results["energyConsumption"] = Number.isFinite(v) ? v : 0; } catch { results["energyConsumption"] = 0; }
  try { const v = (results["energyConsumption"] ?? 0) * input.electricityCost; results["energyCostPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["energyCostPerDay"] = 0; }
  try { const v = input.laborCost * input.operatingHours; results["laborCostPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostPerDay"] = 0; }
  try { const v = (results["energyCostPerDay"] ?? 0) + (results["laborCostPerDay"] ?? 0); results["totalDailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDailyCost"] = 0; }
  try { const v = (results["totalDailyCost"] ?? 0) / (results["packsPerDay"] ?? 0); results["costPerPack"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPack"] = 0; }
  try { const v = ((input.operatingHours - input.maintenanceHours) / input.operatingHours) * 100; results["machineUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["machineUtilization"] = 0; }
  return results;
}


export function calculateCard_shuffler_calculator(input: Card_shuffler_calculatorInput): Card_shuffler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["packsPerDay"] ?? 0;
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


export interface Card_shuffler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

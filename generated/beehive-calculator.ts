// Auto-generated from beehive-calculator-schema.json
import * as z from 'zod';

export interface Beehive_calculatorInput {
  hiveCount: number;
  framesPerHive: number;
  honeyPerFrame: number;
  extractionLoss: number;
  pricePerKg: number;
  costPerHive: number;
}

export const Beehive_calculatorInputSchema = z.object({
  hiveCount: z.number().default(10),
  framesPerHive: z.number().default(10),
  honeyPerFrame: z.number().default(2.5),
  extractionLoss: z.number().default(5),
  pricePerKg: z.number().default(150),
  costPerHive: z.number().default(500),
});

function evaluateAllFormulas(input: Beehive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hiveCount * input.framesPerHive * input.honeyPerFrame; results["grossHoney"] = Number.isFinite(v) ? v : 0; } catch { results["grossHoney"] = 0; }
  try { const v = (results["grossHoney"] ?? 0) * (1 - input.extractionLoss / 100); results["netHoney"] = Number.isFinite(v) ? v : 0; } catch { results["netHoney"] = 0; }
  try { const v = (results["netHoney"] ?? 0) * input.pricePerKg; results["revenue"] = Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.hiveCount * input.costPerHive; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["revenue"] ?? 0) - (results["totalCost"] ?? 0); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((results["profit"] ?? 0) / (results["revenue"] ?? 0)) * 100; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


export function calculateBeehive_calculator(input: Beehive_calculatorInput): Beehive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netHoney"] ?? 0;
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


export interface Beehive_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

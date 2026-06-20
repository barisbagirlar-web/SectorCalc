// Auto-generated from beehive-calculator-schema.json
import * as z from 'zod';

export interface Beehive_calculatorInput {
  hiveCount: number;
  framesPerHive: number;
  honeyPerFrame: number;
  extractionLoss: number;
  pricePerKg: number;
  costPerHive: number;
  dataConfidence?: number;
}

export const Beehive_calculatorInputSchema = z.object({
  hiveCount: z.number().default(10),
  framesPerHive: z.number().default(10),
  honeyPerFrame: z.number().default(2.5),
  extractionLoss: z.number().default(5),
  pricePerKg: z.number().default(150),
  costPerHive: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beehive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hiveCount * input.framesPerHive * input.honeyPerFrame; results["grossHoney"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossHoney"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossHoney"])) * (1 - input.extractionLoss / 100); results["netHoney"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netHoney"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netHoney"])) * input.pricePerKg; results["revenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["revenue"] = Number.NaN; }
  try { const v = input.hiveCount * input.costPerHive; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["revenue"])) - (toNumericFormulaValue(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["profit"])) / (toNumericFormulaValue(results["revenue"]))) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMargin"] = Number.NaN; }
  return results;
}


export function calculateBeehive_calculator(input: Beehive_calculatorInput): Beehive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netHoney"]);
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


export interface Beehive_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

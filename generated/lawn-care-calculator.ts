// Auto-generated from lawn-care-calculator-schema.json
import * as z from 'zod';

export interface Lawn_care_calculatorInput {
  lawnArea: number;
  seedCost: number;
  fertilizerCost: number;
  irrigationCost: number;
  laborRate: number;
  laborHours: number;
  profitMargin: number;
  dataConfidence?: number;
}

export const Lawn_care_calculatorInputSchema = z.object({
  lawnArea: z.number().default(100),
  seedCost: z.number().default(0.5),
  fertilizerCost: z.number().default(0.3),
  irrigationCost: z.number().default(0.1),
  laborRate: z.number().default(25),
  laborHours: z.number().default(4),
  profitMargin: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lawn_care_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.seedCost + input.fertilizerCost + input.irrigationCost) * input.lawnArea; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCost"] = Number.NaN; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCost"])) + (toNumericFormulaValue(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (1 - input.profitMargin / 100); results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPrice"] = Number.NaN; }
  return results;
}


export function calculateLawn_care_calculator(input: Lawn_care_calculatorInput): Lawn_care_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Lawn_care_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from butter-calculator-schema.json
import * as z from 'zod';

export interface Butter_calculatorInput {
  creamVolume: number;
  creamFatPercentage: number;
  butterFatPercentage: number;
  processEfficiency: number;
  saltPercentage: number;
  dataConfidence?: number;
}

export const Butter_calculatorInputSchema = z.object({
  creamVolume: z.number().default(100),
  creamFatPercentage: z.number().default(35),
  butterFatPercentage: z.number().default(80),
  processEfficiency: z.number().default(90),
  saltPercentage: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Butter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.creamVolume * input.creamFatPercentage / 100; results["totalFat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFat"] = 0; }
  try { const v = (asFormulaNumber(results["totalFat"])) / (input.butterFatPercentage / 100); results["theoreticalYield"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theoreticalYield"] = 0; }
  try { const v = (asFormulaNumber(results["theoreticalYield"])) * input.processEfficiency / 100; results["butterYield"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["butterYield"] = 0; }
  try { const v = input.creamVolume - (asFormulaNumber(results["butterYield"])); results["buttermilkVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["buttermilkVolume"] = 0; }
  try { const v = (asFormulaNumber(results["butterYield"])) * input.saltPercentage / 100; results["saltWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = (asFormulaNumber(results["butterYield"])) + (asFormulaNumber(results["saltWeight"])); results["butterWithSalt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["butterWithSalt"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateButter_calculator(input: Butter_calculatorInput): Butter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["butterYield"]));
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


export interface Butter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

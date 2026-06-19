// Auto-generated from fish-tank-calculator-schema.json
import * as z from 'zod';

export interface Fish_tank_calculatorInput {
  tankLength: number;
  tankWidth: number;
  waterDepth: number;
  fishLength: number;
  conditionFactor: number;
  stockingDensity: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Fish_tank_calculatorInputSchema = z.object({
  tankLength: z.number().default(2),
  tankWidth: z.number().default(1),
  waterDepth: z.number().default(0.8),
  fishLength: z.number().default(10),
  conditionFactor: z.number().default(0.02),
  stockingDensity: z.number().default(10),
  safetyFactor: z.number().default(0.8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fish_tank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tankLength * input.tankWidth * input.waterDepth; results["waterVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterVolume"] = 0; }
  try { const v = (asFormulaNumber(results["waterVolume"])) * 1000; results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.stockingDensity * (asFormulaNumber(results["waterVolume"])); results["maxBiomass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxBiomass"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFish_tank_calculator(input: Fish_tank_calculatorInput): Fish_tank_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["maxBiomass"]));
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


export interface Fish_tank_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

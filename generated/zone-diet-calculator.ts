// Auto-generated from zone-diet-calculator-schema.json
import * as z from 'zod';

export interface Zone_diet_calculatorInput {
  weight: number;
  bodyFat: number;
  activityFactor: number;
  dataConfidence?: number;
}

export const Zone_diet_calculatorInputSchema = z.object({
  weight: z.number().default(150),
  bodyFat: z.number().default(20),
  activityFactor: z.number().default(0.7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Zone_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = (asFormulaNumber(results["leanBodyMass"])) * input.activityFactor; results["proteinReq"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinReq"] = 0; }
  try { const v = (asFormulaNumber(results["proteinReq"])) / 7; results["dailyBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyBlocks"] = 0; }
  try { const v = (asFormulaNumber(results["dailyBlocks"])); results["proteinBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinBlocks"] = 0; }
  try { const v = (asFormulaNumber(results["dailyBlocks"])); results["carbBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carbBlocks"] = 0; }
  try { const v = (asFormulaNumber(results["dailyBlocks"])); results["fatBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fatBlocks"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateZone_diet_calculator(input: Zone_diet_calculatorInput): Zone_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dailyBlocks"]));
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


export interface Zone_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

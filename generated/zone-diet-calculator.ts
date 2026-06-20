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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Zone_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leanBodyMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["leanBodyMass"])) * input.activityFactor; results["proteinReq"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinReq"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proteinReq"])) / 7; results["dailyBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyBlocks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyBlocks"])); results["proteinBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinBlocks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyBlocks"])); results["carbBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbBlocks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyBlocks"])); results["fatBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatBlocks"] = Number.NaN; }
  return results;
}


export function calculateZone_diet_calculator(input: Zone_diet_calculatorInput): Zone_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyBlocks"]);
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


export interface Zone_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

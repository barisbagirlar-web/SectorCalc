// Auto-generated from ampacity-calculator-schema.json
import * as z from 'zod';

export interface Ampacity_calculatorInput {
  materialFactor: number;
  area: number;
  insulationTemp: number;
  ambientTemp: number;
  bundlingFactor: number;
  dataConfidence?: number;
}

export const Ampacity_calculatorInputSchema = z.object({
  materialFactor: z.number().default(1),
  area: z.number().default(2.5),
  insulationTemp: z.number().default(60),
  ambientTemp: z.number().default(30),
  bundlingFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ampacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * 1.5; results["baseAmpacity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseAmpacity"] = 0; }
  try { const v = 1 - (input.ambientTemp - 30) * 0.005; results["tempFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempFactor"] = 0; }
  try { const v = (asFormulaNumber(results["baseAmpacity"])) * (asFormulaNumber(results["tempFactor"])) * input.bundlingFactor * input.materialFactor; results["finalAmpacity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalAmpacity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAmpacity_calculator(input: Ampacity_calculatorInput): Ampacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalAmpacity"]);
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


export interface Ampacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

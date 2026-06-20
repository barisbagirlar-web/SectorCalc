// Auto-generated from fsa-calculator-schema.json
import * as z from 'zod';

export interface Fsa_calculatorInput {
  currentFuelConsumption: number;
  annualDistance: number;
  fuelPrice: number;
  efficiencyImprovement: number;
  engineLoadFactor: number;
  operatingYears: number;
  dataConfidence?: number;
}

export const Fsa_calculatorInputSchema = z.object({
  currentFuelConsumption: z.number().default(10),
  annualDistance: z.number().default(30000),
  fuelPrice: z.number().default(1.5),
  efficiencyImprovement: z.number().default(5),
  engineLoadFactor: z.number().default(70),
  operatingYears: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fsa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDistance * (input.currentFuelConsumption / 100) * (input.engineLoadFactor / 100); results["annualFuelUsed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualFuelUsed"] = Number.NaN; }
  try { const v = input.currentFuelConsumption * (1 - input.efficiencyImprovement / 100); results["improvedFuelConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["improvedFuelConsumption"] = Number.NaN; }
  try { const v = input.annualDistance * ((input.currentFuelConsumption - (toNumericFormulaValue(results["improvedFuelConsumption"]))) / 100) * (input.engineLoadFactor / 100); results["annualFuelSaved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualFuelSaved"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualFuelSaved"])) * input.fuelPrice; results["annualCostSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCostSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualCostSavings"])) * input.operatingYears; results["totalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavings"] = Number.NaN; }
  return results;
}


export function calculateFsa_calculator(input: Fsa_calculatorInput): Fsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSavings"]);
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


export interface Fsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

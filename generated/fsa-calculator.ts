// @ts-nocheck
// Auto-generated from fsa-calculator-schema.json
import * as z from 'zod';

export interface Fsa_calculatorInput {
  currentFuelConsumption: number;
  annualDistance: number;
  fuelPrice: number;
  efficiencyImprovement: number;
  engineLoadFactor: number;
  operatingYears: number;
}

export const Fsa_calculatorInputSchema = z.object({
  currentFuelConsumption: z.number().default(10),
  annualDistance: z.number().default(30000),
  fuelPrice: z.number().default(1.5),
  efficiencyImprovement: z.number().default(5),
  engineLoadFactor: z.number().default(70),
  operatingYears: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fsa_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualDistance * (input.currentFuelConsumption / 100) * (input.engineLoadFactor / 100); results["annualFuelUsed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualFuelUsed"] = 0; }
  try { const v = input.currentFuelConsumption * (1 - input.efficiencyImprovement / 100); results["improvedFuelConsumption"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["improvedFuelConsumption"] = 0; }
  try { const v = input.annualDistance * ((input.currentFuelConsumption - (asFormulaNumber(results["improvedFuelConsumption"]))) / 100) * (input.engineLoadFactor / 100); results["annualFuelSaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualFuelSaved"] = 0; }
  try { const v = (asFormulaNumber(results["annualFuelSaved"])) * input.fuelPrice; results["annualCostSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCostSavings"] = 0; }
  try { const v = (asFormulaNumber(results["annualCostSavings"])) * input.operatingYears; results["totalSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSavings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFsa_calculator(input: Fsa_calculatorInput): Fsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSavings"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

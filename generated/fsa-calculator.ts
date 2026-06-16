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

function evaluateAllFormulas(input: Fsa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDistance * (input.currentFuelConsumption / 100) * (input.engineLoadFactor / 100); results["annualFuelUsed"] = Number.isFinite(v) ? v : 0; } catch { results["annualFuelUsed"] = 0; }
  try { const v = input.currentFuelConsumption * (1 - input.efficiencyImprovement / 100); results["improvedFuelConsumption"] = Number.isFinite(v) ? v : 0; } catch { results["improvedFuelConsumption"] = 0; }
  try { const v = input.annualDistance * ((input.currentFuelConsumption - (results["improvedFuelConsumption"] ?? 0)) / 100) * (input.engineLoadFactor / 100); results["annualFuelSaved"] = Number.isFinite(v) ? v : 0; } catch { results["annualFuelSaved"] = 0; }
  try { const v = (results["annualFuelSaved"] ?? 0) * input.fuelPrice; results["annualCostSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualCostSavings"] = 0; }
  try { const v = (results["annualCostSavings"] ?? 0) * input.operatingYears; results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  return results;
}


export function calculateFsa_calculator(input: Fsa_calculatorInput): Fsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSavings"] ?? 0;
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


export interface Fsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

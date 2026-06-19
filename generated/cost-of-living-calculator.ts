// Auto-generated from cost-of-living-calculator-schema.json
import * as z from 'zod';

export interface Cost_of_living_calculatorInput {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  healthcare: number;
  entertainment: number;
  dataConfidence?: number;
}

export const Cost_of_living_calculatorInputSchema = z.object({
  housing: z.number().default(0),
  food: z.number().default(0),
  transportation: z.number().default(0),
  utilities: z.number().default(0),
  healthcare: z.number().default(0),
  entertainment: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_of_living_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.housing + input.food + input.transportation + input.utilities + input.healthcare + input.entertainment; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.housing / (asFormulaNumber(results["totalCost"]))) * 100; results["housingPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["housingPercent"] = 0; }
  try { const v = (input.food / (asFormulaNumber(results["totalCost"]))) * 100; results["foodPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["foodPercent"] = 0; }
  try { const v = (input.transportation / (asFormulaNumber(results["totalCost"]))) * 100; results["transportationPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["transportationPercent"] = 0; }
  try { const v = (input.utilities / (asFormulaNumber(results["totalCost"]))) * 100; results["utilitiesPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["utilitiesPercent"] = 0; }
  try { const v = (input.healthcare / (asFormulaNumber(results["totalCost"]))) * 100; results["healthcarePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["healthcarePercent"] = 0; }
  try { const v = (input.entertainment / (asFormulaNumber(results["totalCost"]))) * 100; results["entertainmentPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["entertainmentPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCost_of_living_calculator(input: Cost_of_living_calculatorInput): Cost_of_living_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Cost_of_living_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

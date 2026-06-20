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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_of_living_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.housing + input.food + input.transportation + input.utilities + input.healthcare + input.entertainment; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (input.housing / (toNumericFormulaValue(results["totalCost"]))) * 100; results["housingPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["housingPercent"] = Number.NaN; }
  try { const v = (input.food / (toNumericFormulaValue(results["totalCost"]))) * 100; results["foodPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["foodPercent"] = Number.NaN; }
  try { const v = (input.transportation / (toNumericFormulaValue(results["totalCost"]))) * 100; results["transportationPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transportationPercent"] = Number.NaN; }
  try { const v = (input.utilities / (toNumericFormulaValue(results["totalCost"]))) * 100; results["utilitiesPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilitiesPercent"] = Number.NaN; }
  try { const v = (input.healthcare / (toNumericFormulaValue(results["totalCost"]))) * 100; results["healthcarePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["healthcarePercent"] = Number.NaN; }
  try { const v = (input.entertainment / (toNumericFormulaValue(results["totalCost"]))) * 100; results["entertainmentPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["entertainmentPercent"] = Number.NaN; }
  return results;
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

// Auto-generated from cost-segregation-calculator-schema.json
import * as z from 'zod';

export interface Cost_segregation_calculatorInput {
  totalPropertyCost: number;
  landPercentage: number;
  buildingPercentage: number;
  personalPropertyPercentage: number;
  landImprovementsPercentage: number;
  buildingLife: number;
  personalPropertyLife: number;
  landImprovementsLife: number;
  dataConfidence?: number;
}

export const Cost_segregation_calculatorInputSchema = z.object({
  totalPropertyCost: z.number().default(1000000),
  landPercentage: z.number().default(20),
  buildingPercentage: z.number().default(60),
  personalPropertyPercentage: z.number().default(15),
  landImprovementsPercentage: z.number().default(5),
  buildingLife: z.number().default(39),
  personalPropertyLife: z.number().default(7),
  landImprovementsLife: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_segregation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalPropertyCost * (input.buildingPercentage / 100); results["buildingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buildingCost"] = Number.NaN; }
  try { const v = input.totalPropertyCost * (input.personalPropertyPercentage / 100); results["personalPropertyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["personalPropertyCost"] = Number.NaN; }
  try { const v = input.totalPropertyCost * (input.landImprovementsPercentage / 100); results["landImprovementsCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["landImprovementsCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["buildingCost"])) / input.buildingLife; results["buildingDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buildingDepreciation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["personalPropertyCost"])) / input.personalPropertyLife; results["personalPropertyDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["personalPropertyDepreciation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["landImprovementsCost"])) / input.landImprovementsLife; results["landImprovementsDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["landImprovementsDepreciation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["buildingDepreciation"])) + (toNumericFormulaValue(results["personalPropertyDepreciation"])) + (toNumericFormulaValue(results["landImprovementsDepreciation"])); results["totalAnnualDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualDepreciation"] = Number.NaN; }
  return results;
}


export function calculateCost_segregation_calculator(input: Cost_segregation_calculatorInput): Cost_segregation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAnnualDepreciation"]);
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


export interface Cost_segregation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

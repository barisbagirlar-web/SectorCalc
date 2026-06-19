// Auto-generated from diet-carbon-footprint-calculator-schema.json
import * as z from 'zod';

export interface Diet_carbon_footprint_calculatorInput {
  meat: number;
  poultry: number;
  dairy: number;
  plant: number;
  grains: number;
  foodWaste: number;
  dataConfidence?: number;
}

export const Diet_carbon_footprint_calculatorInputSchema = z.object({
  meat: z.number().default(0.5),
  poultry: z.number().default(0.5),
  dairy: z.number().default(3),
  plant: z.number().default(5),
  grains: z.number().default(3),
  foodWaste: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diet_carbon_footprint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meat * 25; results["meatCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meatCO2"] = 0; }
  try { const v = input.poultry * 6; results["poultryCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["poultryCO2"] = 0; }
  try { const v = input.dairy * 1.5; results["dairyCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dairyCO2"] = 0; }
  try { const v = input.plant * 0.4; results["plantCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plantCO2"] = 0; }
  try { const v = input.grains * 1.2; results["grainsCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grainsCO2"] = 0; }
  try { const v = input.foodWaste * 2.5; results["wasteCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteCO2"] = 0; }
  try { const v = (asFormulaNumber(results["meatCO2"])) + (asFormulaNumber(results["poultryCO2"])) + (asFormulaNumber(results["dairyCO2"])) + (asFormulaNumber(results["plantCO2"])) + (asFormulaNumber(results["grainsCO2"])) + (asFormulaNumber(results["wasteCO2"])); results["totalWeeklyCO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeeklyCO2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDiet_carbon_footprint_calculator(input: Diet_carbon_footprint_calculatorInput): Diet_carbon_footprint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalWeeklyCO2"]));
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


export interface Diet_carbon_footprint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

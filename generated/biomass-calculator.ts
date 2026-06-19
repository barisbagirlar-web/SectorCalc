// Auto-generated from biomass-calculator-schema.json
import * as z from 'zod';

export interface Biomass_calculatorInput {
  dbh_cm: number;
  height_m: number;
  wood_density: number;
  tree_count: number;
  carbon_fraction: number;
  dataConfidence?: number;
}

export const Biomass_calculatorInputSchema = z.object({
  dbh_cm: z.number().default(30),
  height_m: z.number().default(20),
  wood_density: z.number().default(0.6),
  tree_count: z.number().default(100),
  carbon_fraction: z.number().default(0.47),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Biomass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.0673 * (input.wood_density * input.dbh_cm ** 2 * input.height_m) ** 0.976; results["biomass_per_tree_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["biomass_per_tree_kg"] = 0; }
  try { const v = (asFormulaNumber(results["biomass_per_tree_kg"])) * input.tree_count; results["total_biomass_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_biomass_kg"] = 0; }
  try { const v = (asFormulaNumber(results["total_biomass_kg"])) * input.carbon_fraction; results["total_carbon_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_carbon_kg"] = 0; }
  try { const v = (asFormulaNumber(results["total_carbon_kg"])) * 44 / 12; results["total_co2e_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_co2e_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBiomass_calculator(input: Biomass_calculatorInput): Biomass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_biomass_kg"]));
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


export interface Biomass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

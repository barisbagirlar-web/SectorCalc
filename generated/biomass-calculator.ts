// Auto-generated from biomass-calculator-schema.json
import * as z from 'zod';

export interface Biomass_calculatorInput {
  dbh_cm: number;
  height_m: number;
  wood_density: number;
  tree_count: number;
  carbon_fraction: number;
}

export const Biomass_calculatorInputSchema = z.object({
  dbh_cm: z.number().default(30),
  height_m: z.number().default(20),
  wood_density: z.number().default(0.6),
  tree_count: z.number().default(100),
  carbon_fraction: z.number().default(0.47),
});

function evaluateAllFormulas(input: Biomass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.0673 * (input.wood_density * input.dbh_cm ** 2 * input.height_m) ** 0.976; results["biomass_per_tree_kg"] = Number.isFinite(v) ? v : 0; } catch { results["biomass_per_tree_kg"] = 0; }
  try { const v = (results["biomass_per_tree_kg"] ?? 0) * input.tree_count; results["total_biomass_kg"] = Number.isFinite(v) ? v : 0; } catch { results["total_biomass_kg"] = 0; }
  try { const v = (results["total_biomass_kg"] ?? 0) * input.carbon_fraction; results["total_carbon_kg"] = Number.isFinite(v) ? v : 0; } catch { results["total_carbon_kg"] = 0; }
  try { const v = (results["total_carbon_kg"] ?? 0) * 44 / 12; results["total_co2e_kg"] = Number.isFinite(v) ? v : 0; } catch { results["total_co2e_kg"] = 0; }
  return results;
}


export function calculateBiomass_calculator(input: Biomass_calculatorInput): Biomass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_biomass_kg"] ?? 0;
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


export interface Biomass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from seed-rate-calculator-schema.json
import * as z from 'zod';

export interface Seed_rate_calculatorInput {
  target_population: number;
  germination_rate: number;
  field_emergence_factor: number;
  seed_weight: number;
  row_spacing: number;
  planter_efficiency: number;
  seed_cost_per_unit: number;
  expected_yield_value: number;
  soil_type: string;
  irrigation_available: boolean;
}

export const Seed_rate_calculatorInputSchema = z.object({
  target_population: z.number().min(10000).max(200000).default(75000),
  germination_rate: z.number().min(50).max(100).default(95),
  field_emergence_factor: z.number().min(50).max(100).default(90),
  seed_weight: z.number().min(100).max(600).default(250),
  row_spacing: z.number().min(15).max(100).default(50),
  planter_efficiency: z.number().min(70).max(100).default(95),
  seed_cost_per_unit: z.number().min(0.5).max(50).default(5),
  expected_yield_value: z.number().min(50).max(1000).default(200),
  soil_type: z.enum(['sand', 'loam', 'clay', 'silt', 'peat']).default('loam'),
  irrigation_available: z.boolean().default(false),
});

function evaluateAllFormulas(input: Seed_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["adjusted_germination_rate"] = (input.germination_rate / 100) * (input.field_emergence_factor / 100); } catch { results["adjusted_germination_rate"] = 0; }
  try { results["required_seeds_per_hectare"] = input.target_population / ((results["adjusted_germination_rate"] ?? 0) * (input.planter_efficiency / 100)); } catch { results["required_seeds_per_hectare"] = 0; }
  try { results["seeding_rate_mass"] = ((results["required_seeds_per_hectare"] ?? 0) * input.seed_weight) / 1000000; } catch { results["seeding_rate_mass"] = 0; }
  try { results["seed_spacing_in_row"] = (input.row_spacing / 100) * 10000 / (results["required_seeds_per_hectare"] ?? 0) * 100; } catch { results["seed_spacing_in_row"] = 0; }
  try { results["total_seed_cost_per_hectare"] = (results["seeding_rate_mass"] ?? 0) * input.seed_cost_per_unit; } catch { results["total_seed_cost_per_hectare"] = 0; }
  try { results["potential_yield_value_per_hectare"] = (input.target_population * 0.0005) * input.expected_yield_value; } catch { results["potential_yield_value_per_hectare"] = 0; }
  try { results["net_seed_roi"] = (((results["potential_yield_value_per_hectare"] ?? 0) - (results["total_seed_cost_per_hectare"] ?? 0)) / (results["total_seed_cost_per_hectare"] ?? 0)) * 100; } catch { results["net_seed_roi"] = 0; }
  return results;
}


export function calculateSeed_rate_calculator(input: Seed_rate_calculatorInput): Seed_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommended_seeding_rate"] ?? 0;
  const breakdown = {
    adjusted_germination_rate: values["adjusted_germination_rate"] ?? 0,
    required_seeds_per_hectare: values["required_seeds_per_hectare"] ?? 0,
    seed_spacing_in_row: values["seed_spacing_in_row"] ?? 0,
    total_seed_cost_per_hectare: values["total_seed_cost_per_hectare"] ?? 0,
    potential_yield_value_per_hectare: values["potential_yield_value_per_hectare"] ?? 0,
    net_seed_roi: values["net_seed_roi"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Germination Loss","Emergence Loss","Planter Inefficiency Loss","Combined Loss Factor"];
  const suggestedActions: string[] = ["Use high-vigor seed lot or apply seed treatment to improve germination rate.","Conduct planter calibration and preventive maintenance per Six Sigma DMAIC to reduce skips and doubles.","Re-evaluate row spacing for optimal plant distribution; consider variable rate seeding.","Review seed cost vs. yield value; consider alternative seed varieties or reduced population."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Historical data integration"],
  };
}


export interface Seed_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: { adjusted_germination_rate: number; required_seeds_per_hectare: number; seed_spacing_in_row: number; total_seed_cost_per_hectare: number; potential_yield_value_per_hectare: number; net_seed_roi: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

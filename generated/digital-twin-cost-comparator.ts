// Auto-generated from digital-twin-cost-comparator-schema.json
import * as z from 'zod';

export interface Digital_twin_cost_comparatorInput {
  twin_scope: string;
  asset_count: number;
  sensor_density: number;
  data_frequency: string;
  integration_complexity: string;
  data_quality_index: number;
  labor_rate: number;
  expected_lifespan: number;
  lean_six_sigma_level: string;
  werc_benchmark: number;
}

export const Digital_twin_cost_comparatorInputSchema = z.object({
  twin_scope: z.string().default(''),
  asset_count: z.number().min(1).max(100000).default(100),
  sensor_density: z.number().min(0).max(100).default(5),
  data_frequency: z.string().default(''),
  integration_complexity: z.string().default(''),
  data_quality_index: z.number().min(0).max(100).default(85),
  labor_rate: z.number().min(15).max(250).default(75),
  expected_lifespan: z.number().min(1).max(30).default(10),
  lean_six_sigma_level: z.string().default(''),
  werc_benchmark: z.number().min(0.5).max(50).default(5.5),
});

function evaluateAllFormulas(input: Digital_twin_cost_comparatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.asset_count * input.sensor_density * input.data_frequency * 3600 * 24 * 365 * 1e-12; results["sub_formula_data_volume"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_data_volume"] = 0; }
  try { const v = data_volume * 150 * (1 + 0.2 * (input.integration_complexity == 'high' ? 2 : input.integration_complexity == 'medium' ? 1 : 0)); results["sub_formula_infrastructure_cost"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_infrastructure_cost"] = 0; }
  try { const v = input.asset_count * 10 * input.labor_rate * input.expected_lifespan * (1 - 0.05 * (input.lean_six_sigma_level == 'level5' ? 4 : input.lean_six_sigma_level == 'level4' ? 3 : input.lean_six_sigma_level == 'level3' ? 2 : input.lean_six_sigma_level == 'level2' ? 1 : 0)); results["sub_formula_labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_labor_cost"] = 0; }
  try { const v = input.asset_count * (input.twin_scope == 'enterprise' ? 200 : input.twin_scope == 'system' ? 150 : input.twin_scope == 'process' ? 100 : 50) * input.expected_lifespan; results["sub_formula_software_license_cost"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_software_license_cost"] = 0; }
  try { const v = (infrastructure_cost + software_license_cost) * 0.15 * input.expected_lifespan; results["sub_formula_maintenance_cost"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_maintenance_cost"] = 0; }
  try { const v = infrastructure_cost + labor_cost + software_license_cost + maintenance_cost; results["sub_formula_total_cost_of_ownership"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_total_cost_of_ownership"] = 0; }
  try { const v = -total_cost_of_ownership + (input.werc_benchmark * input.asset_count * 0.1 * input.expected_lifespan) / (1 + 0.08); results["sub_formula_net_present_value"] = Number.isFinite(v) ? v : 0; } catch { results["sub_formula_net_present_value"] = 0; }
  return results;
}


export function calculateDigital_twin_cost_comparator(input: Digital_twin_cost_comparatorInput): Digital_twin_cost_comparatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_asset"] ?? 0;
  const breakdown = {
    infrastructure_cost_per_asset: values["infrastructure_cost_per_asset"] ?? 0,
    labor_cost_per_asset: values["labor_cost_per_asset"] ?? 0,
    software_license_cost_per_asset: values["software_license_cost_per_asset"] ?? 0,
    maintenance_cost_per_asset: values["maintenance_cost_per_asset"] ?? 0,
    data_volume_per_asset: values["data_volume_per_asset"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Data Quality Loss","Integration Inefficiency Loss","Lean Waste Loss"];
  const suggestedActions: string[] = ["Implement data governance framework per ISO 8000 to improve DQI above 85%.","Adopt standardized APIs and middleware to lower integration complexity from high to medium.","Invest in Lean Six Sigma training to move from level 3 to level 4 maturity.","Deploy edge computing to reduce data volume and cloud costs."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Real-time data integration","Benchmarking against industry standards"],
  };
}


export interface Digital_twin_cost_comparatorOutput {
  totalWasteCost: number;
  breakdown: { infrastructure_cost_per_asset: number; labor_cost_per_asset: number; software_license_cost_per_asset: number; maintenance_cost_per_asset: number; data_volume_per_asset: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

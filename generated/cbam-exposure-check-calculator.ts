// Auto-generated from cbam-exposure-check-calculator-schema.json
import * as z from 'zod';

export interface Cbam_exposure_check_calculatorInput {
  annual_production_volume: number;
  carbon_intensity: number;
  cbam_carbon_price: number;
  free_allocation_percentage: number;
  production_efficiency_index: number;
  compliance_readiness_score: number;
  industry_benchmark_intensity: number;
  emission_scope: string;
  use_verified_data: boolean;
}

export const Cbam_exposure_check_calculatorInputSchema = z.object({
  annual_production_volume: z.number().min(0).max(10000000).default(100000),
  carbon_intensity: z.number().min(0).max(10).default(1.8),
  cbam_carbon_price: z.number().min(0).max(500).default(90),
  free_allocation_percentage: z.number().min(0).max(100).default(20),
  production_efficiency_index: z.number().min(0).max(1).default(0.85),
  compliance_readiness_score: z.number().min(0).max(100).default(60),
  industry_benchmark_intensity: z.number().min(0).max(10).default(1.2),
  emission_scope: z.enum(['Scope 1 only', 'Scope 1 & 2', 'Scope 1, 2 & 3']).default('Scope 1 & 2'),
  use_verified_data: z.boolean().default(false),
});

function evaluateAllFormulas(input: Cbam_exposure_check_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_production_volume * input.carbon_intensity; results["total_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["total_emissions"] = 0; }
  try { const v = (results["total_emissions"] ?? 0) * (input.free_allocation_percentage / 100); results["allowable_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["allowable_emissions"] = 0; }
  try { const v = (results["total_emissions"] ?? 0) - (results["allowable_emissions"] ?? 0); results["exposed_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["exposed_emissions"] = 0; }
  try { const v = ((results["exposed_emissions"] ?? 0) * input.cbam_carbon_price) / input.annual_production_volume; results["cbam_cost_per_ton"] = Number.isFinite(v) ? v : 0; } catch { results["cbam_cost_per_ton"] = 0; }
  try { const v = (results["cbam_cost_per_ton"] ?? 0) / input.production_efficiency_index; results["efficiency_adjusted_cost"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency_adjusted_cost"] = 0; }
  try { const v = 1 + ((100 - input.compliance_readiness_score) / 100); results["compliance_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["compliance_risk_factor"] = 0; }
  try { const v = (results["efficiency_adjusted_cost"] ?? 0) * (results["compliance_risk_factor"] ?? 0) * input.annual_production_volume; results["total_cbam_exposure"] = Number.isFinite(v) ? v : 0; } catch { results["total_cbam_exposure"] = 0; }
  return results;
}


export function calculateCbam_exposure_check_calculator(input: Cbam_exposure_check_calculatorInput): Cbam_exposure_check_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cbam_exposure"] ?? 0;
  const breakdown = {
    total_emissions: values["total_emissions"] ?? 0,
    allowable_emissions: values["allowable_emissions"] ?? 0,
    exposed_emissions: values["exposed_emissions"] ?? 0,
    cbam_cost_per_ton: values["cbam_cost_per_ton"] ?? 0,
    efficiency_adjusted_cost: values["efficiency_adjusted_cost"] ?? 0,
    compliance_risk_factor: values["compliance_risk_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Low Efficiency Waste","Benchmark Gap","Compliance Data Gap"];
  const suggestedActions: string[] = ["Improve Overall Equipment Effectiveness","Reduce Carbon Intensity","Enhance Compliance Data System","Optimize Free Allocation Strategy"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Cbam_exposure_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: { total_emissions: number; allowable_emissions: number; exposed_emissions: number; cbam_cost_per_ton: number; efficiency_adjusted_cost: number; compliance_risk_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

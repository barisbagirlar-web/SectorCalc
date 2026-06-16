// Auto-generated from noise-vibration-cost-schema.json
import * as z from 'zod';

export interface Noise_vibration_costInput {
  num_workers_exposed: number;
  avg_daily_exposure_hours: number;
  noise_level_dba: number;
  vibration_level_ms2: number;
  machine_runtime_hours_per_day: number;
  maintenance_cost_per_machine_per_year: number;
  number_of_machines: number;
  avg_worker_annual_salary: number;
  hearing_protection_cost_per_worker_per_year: number;
  quality_defect_rate_percent: number;
  annual_production_volume: number;
  cost_per_defect: number;
  energy_cost_per_kwh: number;
  machine_power_kw: number;
  vibration_reduction_investment: number;
  noise_reduction_investment: number;
  iso_standard_compliance: string;
}

export const Noise_vibration_costInputSchema = z.object({
  num_workers_exposed: z.number().min(1).max(10000).default(10),
  avg_daily_exposure_hours: z.number().min(0.5).max(16).default(8),
  noise_level_dba: z.number().min(60).max(130).default(85),
  vibration_level_ms2: z.number().min(0.1).max(20).default(0.5),
  machine_runtime_hours_per_day: z.number().min(1).max(24).default(16),
  maintenance_cost_per_machine_per_year: z.number().min(0).max(1000000).default(5000),
  number_of_machines: z.number().min(1).max(500).default(5),
  avg_worker_annual_salary: z.number().min(15000).max(200000).default(45000),
  hearing_protection_cost_per_worker_per_year: z.number().min(0).max(2000).default(150),
  quality_defect_rate_percent: z.number().min(0).max(50).default(2.5),
  annual_production_volume: z.number().min(100).max(100000000).default(100000),
  cost_per_defect: z.number().min(0.1).max(10000).default(25),
  energy_cost_per_kwh: z.number().min(0.01).max(1).default(0.12),
  machine_power_kw: z.number().min(1).max(5000).default(50),
  vibration_reduction_investment: z.number().min(0).max(5000000).default(50000),
  noise_reduction_investment: z.number().min(0).max(5000000).default(30000),
  iso_standard_compliance: z.enum(['None', 'ISO 2631-1 (Whole-body)', 'ISO 2631-2 (Building)', 'ISO 5349 (Hand-arm)', 'ISO 9612 (Noise)']).default('None'),
});

function evaluateAllFormulas(input: Noise_vibration_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.num_workers_exposed * input.avg_worker_annual_salary * (Math.max(0, (input.noise_level_dba - 80) * 0.005) + Math.max(0, (input.vibration_level_ms2 - 0.3) * 10 * 0.01)); results["productivity_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["productivity_loss_cost"] = 0; }
  try { const v = input.num_workers_exposed * input.hearing_protection_cost_per_worker_per_year + (input.num_workers_exposed * 50 * (input.vibration_level_ms2 > 0.5 ? 1 : 0)); results["health_and_ppe_cost"] = Number.isFinite(v) ? v : 0; } catch { results["health_and_ppe_cost"] = 0; }
  try { const v = input.annual_production_volume * (input.quality_defect_rate_percent / 100) * input.cost_per_defect; results["quality_defect_cost"] = Number.isFinite(v) ? v : 0; } catch { results["quality_defect_cost"] = 0; }
  try { const v = input.number_of_machines * input.machine_power_kw * input.machine_runtime_hours_per_day * 365 * input.energy_cost_per_kwh * (0.05 * Math.max(0, input.vibration_level_ms2 - 0.5)); results["excess_energy_cost"] = Number.isFinite(v) ? v : 0; } catch { results["excess_energy_cost"] = 0; }
  try { const v = input.number_of_machines * input.maintenance_cost_per_machine_per_year * (0.10 * Math.max(0, input.vibration_level_ms2 - 0.3)); results["excess_maintenance_cost"] = Number.isFinite(v) ? v : 0; } catch { results["excess_maintenance_cost"] = 0; }
  try { const v = (results["productivity_loss_cost"] ?? 0) + (results["health_and_ppe_cost"] ?? 0) + (results["quality_defect_cost"] ?? 0) + (results["excess_energy_cost"] ?? 0) + (results["excess_maintenance_cost"] ?? 0); results["total_annual_loss"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_loss"] = 0; }
  try { const v = ((results["total_annual_loss"] ?? 0) * 0.5 * 5) - (input.noise_reduction_investment + input.vibration_reduction_investment); results["roi_improvement"] = Number.isFinite(v) ? v : 0; } catch { results["roi_improvement"] = 0; }
  return results;
}


export function calculateNoise_vibration_cost(input: Noise_vibration_costInput): Noise_vibration_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_loss"] ?? 0;
  const breakdown = {
    productivityLossCost: values["productivityLossCost"] ?? 0,
    healthAndPpeCost: values["healthAndPpeCost"] ?? 0,
    qualityDefectCost: values["qualityDefectCost"] ?? 0,
    excessEnergyCost: values["excessEnergyCost"] ?? 0,
    excessMaintenanceCost: values["excessMaintenanceCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Absenteeism due to noise/vibration","Regulatory non-compliance fines","Increased turnover costs","Brand reputation damage"];
  const suggestedActions: string[] = ["Implement engineering controls for vibration (isolators, dampers) on machines exceeding 1.15 m/s².","Install acoustic enclosures or barriers for noise sources above 85 dB(A).","Initiate a Six Sigma DMAIC project to reduce vibration-induced defects by 50%.","Establish a predictive maintenance program using vibration monitoring.","Rotate workers to reduce daily exposure hours below 8 hours."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold configuration"],
  };
}


export interface Noise_vibration_costOutput {
  totalWasteCost: number;
  breakdown: { productivityLossCost: number; healthAndPpeCost: number; qualityDefectCost: number; excessEnergyCost: number; excessMaintenanceCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

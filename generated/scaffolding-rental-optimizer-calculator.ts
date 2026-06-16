// Auto-generated from scaffolding-rental-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Scaffolding_rental_optimizer_calculatorInput {
  project_duration_days: number;
  total_scaffold_area_sqm: number;
  rental_rate_per_sqm_per_day: number;
  transport_cost_per_trip: number;
  number_of_trips: number;
  labor_cost_per_hour: number;
  erection_hours_per_sqm: number;
  dismantle_hours_per_sqm: number;
  utilization_rate: number;
  waste_factor: number;
  region: string;
  include_insurance: boolean;
}

export const Scaffolding_rental_optimizer_calculatorInputSchema = z.object({
  project_duration_days: z.number().min(1).max(365).default(30),
  total_scaffold_area_sqm: z.number().min(10).max(10000).default(500),
  rental_rate_per_sqm_per_day: z.number().min(0.5).max(20).default(2.5),
  transport_cost_per_trip: z.number().min(50).max(2000).default(200),
  number_of_trips: z.number().min(1).max(50).default(4),
  labor_cost_per_hour: z.number().min(10).max(100).default(35),
  erection_hours_per_sqm: z.number().min(0.1).max(1).default(0.3),
  dismantle_hours_per_sqm: z.number().min(0.05).max(0.8).default(0.2),
  utilization_rate: z.number().min(10).max(100).default(85),
  waste_factor: z.number().min(0).max(20).default(5),
  region: z.enum(['US', 'EU', 'Asia', 'Other']).default('US'),
  include_insurance: z.boolean().default(true),
});

function evaluateAllFormulas(input: Scaffolding_rental_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_scaffold_area_sqm * (1 + input.waste_factor / 100); results["net_scaffold_area"] = Number.isFinite(v) ? v : 0; } catch { results["net_scaffold_area"] = 0; }
  try { const v = (results["net_scaffold_area"] ?? 0) * input.rental_rate_per_sqm_per_day * input.project_duration_days; results["rental_cost"] = Number.isFinite(v) ? v : 0; } catch { results["rental_cost"] = 0; }
  try { const v = input.transport_cost_per_trip * input.number_of_trips; results["transport_cost"] = Number.isFinite(v) ? v : 0; } catch { results["transport_cost"] = 0; }
  try { const v = input.total_scaffold_area_sqm * (input.erection_hours_per_sqm + input.dismantle_hours_per_sqm) * input.labor_cost_per_hour; results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = input.include_insurance ? (results["rental_cost"] ?? 0) * 0.02 : 0; results["insurance_cost"] = Number.isFinite(v) ? v : 0; } catch { results["insurance_cost"] = 0; }
  try { const v = (results["rental_cost"] ?? 0) + (results["transport_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["insurance_cost"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (results["total_cost"] ?? 0) / input.total_scaffold_area_sqm; results["cost_per_sqm"] = Number.isFinite(v) ? v : 0; } catch { results["cost_per_sqm"] = 0; }
  return results;
}


export function calculateScaffolding_rental_optimizer_calculator(input: Scaffolding_rental_optimizer_calculatorInput): Scaffolding_rental_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    rental_cost: values["rental_cost"] ?? 0,
    transport_cost: values["transport_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    insurance_cost: values["insurance_cost"] ?? 0,
    cost_per_sqm: values["cost_per_sqm"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Idle Time Loss","Waste Loss","Inefficiency Loss"];
  const suggestedActions: string[] = ["Increase utilization rate to above 80% by consolidating work schedules.","Implement 5S methodology to reduce waste factor below 5%.","Combine deliveries to reduce number of trips by 25%.","Consider prefabricated scaffolding modules to reduce labor hours."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated reorder suggestions"],
  };
}


export interface Scaffolding_rental_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { rental_cost: number; transport_cost: number; labor_cost: number; insurance_cost: number; cost_per_sqm: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

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

function evaluateAllFormulas(_input: Scaffolding_rental_optimizer_calculatorInput): Record<string, number> {
  return {};
}


export function calculateScaffolding_rental_optimizer_calculator(input: Scaffolding_rental_optimizer_calculatorInput): Scaffolding_rental_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["0"] ?? 0;
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated reorder suggestions"],
  };
}


export interface Scaffolding_rental_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

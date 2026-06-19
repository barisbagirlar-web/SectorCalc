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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scaffolding_rental_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.erection_hours_per_sqm * input.total_scaffold_area_sqm) + (input.dismantle_hours_per_sqm * input.total_scaffold_area_sqm); results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.number_of_trips * (input.rental_rate_per_sqm_per_day / 100) * (input.labor_cost_per_hour * input.project_duration_days) * input.transport_cost_per_trip; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.number_of_trips * (input.rental_rate_per_sqm_per_day / 100) * (input.labor_cost_per_hour * input.project_duration_days) * input.transport_cost_per_trip; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScaffolding_rental_optimizer_calculator(input: Scaffolding_rental_optimizer_calculatorInput): Scaffolding_rental_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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

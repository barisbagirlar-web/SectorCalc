// Auto-generated from route-optimization-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Route_optimization_analyzer_calculatorInput {
  num_stops: number;
  total_distance: number;
  avg_speed: number;
  dwell_time_per_stop: number;
  fuel_cost_per_km: number;
  driver_hourly_rate: number;
  vehicle_type: string;
  traffic_condition: string;
  dataConfidence?: number;
}

export const Route_optimization_analyzer_calculatorInputSchema = z.object({
  num_stops: z.number().min(1).max(200).default(10),
  total_distance: z.number().min(0).max(5000).default(150),
  avg_speed: z.number().min(5).max(120).default(40),
  dwell_time_per_stop: z.number().min(0).max(120).default(10),
  fuel_cost_per_km: z.number().min(0).max(10).default(1.2),
  driver_hourly_rate: z.number().min(0).max(100).default(25),
  vehicle_type: z.enum(['van', 'truck_light', 'truck_heavy', 'refrigerated']).default('van'),
  traffic_condition: z.enum(['light', 'moderate', 'heavy']).default('moderate'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Route_optimization_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_speed; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.num_stops * (input.driver_hourly_rate / 100) * input.avg_speed * input.fuel_cost_per_km; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.num_stops * (input.driver_hourly_rate / 100) * input.avg_speed * input.fuel_cost_per_km; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoute_optimization_analyzer_calculator(input: Route_optimization_analyzer_calculatorInput): Route_optimization_analyzer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time GPS integration"],
  };
}


export interface Route_optimization_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from downtime-cost-calculator-schema.json
import * as z from 'zod';

export interface Downtime_cost_calculatorInput {
  planned_production_rate: number;
  downtime_duration: number;
  revenue_per_unit: number;
  direct_labor_cost_per_hour: number;
  energy_cost_per_hour: number;
  scrap_rate_during_downtime: number;
  recovery_time_factor: number;
  shift_type: string;
  dataConfidence?: number;
}

export const Downtime_cost_calculatorInputSchema = z.object({
  planned_production_rate: z.number().min(0).max(10000).default(100),
  downtime_duration: z.number().min(0).max(168).default(2),
  revenue_per_unit: z.number().min(0).max(100000).default(50),
  direct_labor_cost_per_hour: z.number().min(0).max(500).default(30),
  energy_cost_per_hour: z.number().min(0).max(1000).default(15),
  scrap_rate_during_downtime: z.number().min(0).max(100).default(5),
  recovery_time_factor: z.number().min(0).max(2).default(0.3),
  shift_type: z.enum(['day', 'night', 'weekend']).default('day'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Downtime_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.planned_production_rate / 100) * input.downtime_duration * input.revenue_per_unit * input.direct_labor_cost_per_hour; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.planned_production_rate / 100) * input.downtime_duration * input.revenue_per_unit * input.direct_labor_cost_per_hour * (input.energy_cost_per_hour * (input.scrap_rate_during_downtime / 100) * input.recovery_time_factor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.energy_cost_per_hour * (input.scrap_rate_during_downtime / 100) * input.recovery_time_factor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDowntime_cost_calculator(input: Downtime_cost_calculatorInput): Downtime_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold alerts"],
  };
}


export interface Downtime_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

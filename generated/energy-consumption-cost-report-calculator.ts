// Auto-generated from energy-consumption-cost-report-calculator-schema.json
import * as z from 'zod';

export interface Energy_consumption_cost_report_calculatorInput {
  total_energy_kwh: number;
  peak_demand_kw: number;
  tariff_rate_per_kwh: number;
  demand_charge_per_kw: number;
  production_units: number;
  facility_type: string;
  include_renewable_offset: boolean;
  renewable_kwh: number;
  dataConfidence?: number;
}

export const Energy_consumption_cost_report_calculatorInputSchema = z.object({
  total_energy_kwh: z.number().min(0).max(100000000).default(100000),
  peak_demand_kw: z.number().min(0).max(100000).default(500),
  tariff_rate_per_kwh: z.number().min(0).max(10).default(0.12),
  demand_charge_per_kw: z.number().min(0).max(100).default(10),
  production_units: z.number().min(0).max(100000000).default(50000),
  facility_type: z.enum(['manufacturing', 'warehouse', 'office', 'data_center', 'retail']).default('manufacturing'),
  include_renewable_offset: z.boolean().default(false),
  renewable_kwh: z.number().min(0).max(100000000).default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Energy_consumption_cost_report_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_energy_kwh * input.peak_demand_kw * (input.tariff_rate_per_kwh / 100) * input.demand_charge_per_kw; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_energy_kwh * input.peak_demand_kw * (input.tariff_rate_per_kwh / 100) * input.demand_charge_per_kw * (input.production_units * input.renewable_kwh); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.production_units * input.renewable_kwh; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEnergy_consumption_cost_report_calculator(input: Energy_consumption_cost_report_calculatorInput): Energy_consumption_cost_report_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Anomaly detection alerts"],
  };
}


export interface Energy_consumption_cost_report_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

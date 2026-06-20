// Auto-generated from irrigation-cost-check-calculator-schema.json
import * as z from 'zod';

export interface Irrigation_cost_check_calculatorInput {
  water_volume: number;
  water_cost_per_m3: number;
  energy_cost_per_kwh: number;
  pump_efficiency: number;
  distribution_losses: number;
  labor_hours_per_year: number;
  labor_rate: number;
  maintenance_cost: number;
  dataConfidence?: number;
}

export const Irrigation_cost_check_calculatorInputSchema = z.object({
  water_volume: z.number().min(0).max(1000000).default(10000),
  water_cost_per_m3: z.number().min(0).max(10).default(0.5),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
  pump_efficiency: z.number().min(10).max(100).default(70),
  distribution_losses: z.number().min(0).max(50).default(15),
  labor_hours_per_year: z.number().min(0).max(10000).default(500),
  labor_rate: z.number().min(0).max(100).default(25),
  maintenance_cost: z.number().min(0).max(100000).default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Irrigation_cost_check_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.water_volume * input.water_cost_per_m3 * input.energy_cost_per_kwh * (input.pump_efficiency / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.water_volume * input.water_cost_per_m3 * input.energy_cost_per_kwh * (input.pump_efficiency / 100) * ((input.distribution_losses / 100) * input.labor_hours_per_year * (input.labor_rate / 100) * input.maintenance_cost); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.distribution_losses / 100) * input.labor_hours_per_year * (input.labor_rate / 100) * input.maintenance_cost; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIrrigation_cost_check_calculator(input: Irrigation_cost_check_calculatorInput): Irrigation_cost_check_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-site comparison"],
  };
}


export interface Irrigation_cost_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

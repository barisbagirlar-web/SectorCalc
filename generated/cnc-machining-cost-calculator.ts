// Auto-generated from cnc-machining-cost-calculator-schema.json
import * as z from 'zod';

export interface Cnc_machining_cost_calculatorInput {
  material_type: string;
  part_weight_kg: number;
  stock_volume_cm3: number;
  machining_time_min: number;
  setup_time_min: number;
  batch_size: number;
  machine_hourly_rate_usd: number;
  labor_hourly_rate_usd: number;
  dataConfidence?: number;
}

export const Cnc_machining_cost_calculatorInputSchema = z.object({
  material_type: z.enum(['aluminum_6061', 'steel_1018', 'stainless_304', 'titanium_6al4v', 'brass_c360']).default('aluminum_6061'),
  part_weight_kg: z.number().min(0.001).max(500).default(0.5),
  stock_volume_cm3: z.number().min(1).max(100000).default(200),
  machining_time_min: z.number().min(0.1).max(1440).default(15),
  setup_time_min: z.number().min(0).max(480).default(60),
  batch_size: z.number().min(1).max(100000).default(100),
  machine_hourly_rate_usd: z.number().min(20).max(500).default(85),
  labor_hourly_rate_usd: z.number().min(10).max(150).default(35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cnc_machining_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.part_weight_kg * input.stock_volume_cm3 * input.machining_time_min * input.setup_time_min; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.part_weight_kg * input.stock_volume_cm3 * input.machining_time_min * input.setup_time_min * (input.batch_size * (input.machine_hourly_rate_usd / 100) * (input.labor_hourly_rate_usd / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.batch_size * (input.machine_hourly_rate_usd / 100) * (input.labor_hourly_rate_usd / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCnc_machining_cost_calculator(input: Cnc_machining_cost_calculatorInput): Cnc_machining_cost_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cnc_machining_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

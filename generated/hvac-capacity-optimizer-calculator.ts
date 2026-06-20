// Auto-generated from hvac-capacity-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Hvac_capacity_optimizer_calculatorInput {
  cooling_load: number;
  heating_load: number;
  system_type: string;
  ambient_temperature: number;
  relative_humidity: number;
  efficiency_ratio: number;
  airflow_rate: number;
  duct_leakage_factor: number;
  dataConfidence?: number;
}

export const Hvac_capacity_optimizer_calculatorInputSchema = z.object({
  cooling_load: z.number().min(0).max(10000).default(100),
  heating_load: z.number().min(0).max(10000).default(80),
  system_type: z.enum(['VAV', 'CAV', 'VRF', 'Chilled Beam', 'Heat Pump']).default('VAV'),
  ambient_temperature: z.number().min(-20).max(55).default(35),
  relative_humidity: z.number().min(0).max(100).default(50),
  efficiency_ratio: z.number().min(1).max(7).default(3.5),
  airflow_rate: z.number().min(0.1).max(50).default(2.5),
  duct_leakage_factor: z.number().min(0).max(30).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hvac_capacity_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cooling_load * input.heating_load * input.ambient_temperature * (input.relative_humidity / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.cooling_load * input.heating_load * input.ambient_temperature * (input.relative_humidity / 100) * ((input.efficiency_ratio / 100) * (input.airflow_rate / 100) * (input.duct_leakage_factor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.efficiency_ratio / 100) * (input.airflow_rate / 100) * (input.duct_leakage_factor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHvac_capacity_optimizer_calculator(input: Hvac_capacity_optimizer_calculatorInput): Hvac_capacity_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-zone comparison","Automated report generation"],
  };
}


export interface Hvac_capacity_optimizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hvac_capacity_optimizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;


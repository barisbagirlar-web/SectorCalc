// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hvac_capacity_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cooling_load * input.heating_load * input.ambient_temperature * (input.relative_humidity / 100); results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cooling_load * input.heating_load * input.ambient_temperature * (input.relative_humidity / 100) * ((input.efficiency_ratio / 100) * (input.airflow_rate / 100) * (input.duct_leakage_factor / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.efficiency_ratio / 100) * (input.airflow_rate / 100) * (input.duct_leakage_factor / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHvac_capacity_optimizer_calculator(input: Hvac_capacity_optimizer_calculatorInput): Hvac_capacity_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-zone comparison","Automated report generation"],
  };
}


export interface Hvac_capacity_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

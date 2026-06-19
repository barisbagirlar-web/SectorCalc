// Auto-generated from hp-to-kw-converter-calculator-schema.json
import * as z from 'zod';

export interface Hp_to_kw_converter_calculatorInput {
  horsepower: number;
  hp_type: string;
  motor_efficiency: number;
  load_factor: number;
  power_factor: number;
  operating_hours_per_year: number;
  electricity_cost_per_kwh: number;
  dataConfidence?: number;
}

export const Hp_to_kw_converter_calculatorInputSchema = z.object({
  horsepower: z.number().min(0.1).max(10000).default(100),
  hp_type: z.enum(['mechanical', 'metric', 'electrical']).default('mechanical'),
  motor_efficiency: z.number().min(50).max(99.9).default(90),
  load_factor: z.number().min(10).max(100).default(100),
  power_factor: z.number().min(0.5).max(1).default(0.85),
  operating_hours_per_year: z.number().min(0).max(8760).default(8000),
  electricity_cost_per_kwh: z.number().min(0.01).max(1).default(0.12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hp_to_kw_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 * input.horsepower * input.operating_hours_per_year * (input.motor_efficiency / 100); results["annual_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_kwh"] = 0; }
  try { const v = 1 * input.horsepower * input.operating_hours_per_year * (input.motor_efficiency / 100) * input.electricity_cost_per_kwh; results["annual_energy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_energy_cost"] = 0; }
  try { const v = 1 * input.horsepower * input.operating_hours_per_year * (input.motor_efficiency / 100) * input.electricity_cost_per_kwh; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHp_to_kw_converter_calculator(input: Hp_to_kw_converter_calculatorInput): Hp_to_kw_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Hp_to_kw_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

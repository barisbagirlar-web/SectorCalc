// Auto-generated from compressor-energy-cost-calculator-schema.json
import * as z from 'zod';

export interface Compressor_energy_cost_calculatorInput {
  compressor_power_rating: number;
  motor_efficiency: number;
  compressor_type: string;
  operating_hours_per_year: number;
  load_factor: number;
  electricity_cost_per_kwh: number;
  leakage_percentage: number;
  pressure_setpoint: number;
  dataConfidence?: number;
}

export const Compressor_energy_cost_calculatorInputSchema = z.object({
  compressor_power_rating: z.number().min(1).max(5000).default(75),
  motor_efficiency: z.number().min(70).max(99).default(92),
  compressor_type: z.enum(['reciprocating', 'rotary_screw', 'centrifugal', 'scroll']).default('rotary_screw'),
  operating_hours_per_year: z.number().min(100).max(8760).default(8000),
  load_factor: z.number().min(10).max(100).default(70),
  electricity_cost_per_kwh: z.number().min(0.01).max(0.5).default(0.12),
  leakage_percentage: z.number().min(0).max(50).default(20),
  pressure_setpoint: z.number().min(2).max(15).default(7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compressor_energy_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 * input.compressor_power_rating * input.operating_hours_per_year * (input.motor_efficiency / 100); results["annual_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_kwh"] = Number.NaN; }
  try { const v = 1 * input.compressor_power_rating * input.operating_hours_per_year * (input.motor_efficiency / 100) * input.electricity_cost_per_kwh; results["annual_energy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_energy_cost"] = Number.NaN; }
  try { const v = 1 * input.compressor_power_rating * input.operating_hours_per_year * (input.motor_efficiency / 100) * input.electricity_cost_per_kwh; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCompressor_energy_cost_calculator(input: Compressor_energy_cost_calculatorInput): Compressor_energy_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    annual_kwh: toNumericFormulaValue(values["annual_kwh"]),
    annual_energy_cost: toNumericFormulaValue(values["annual_energy_cost"])
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-compressor optimization","Real-time monitoring integration","Custom reporting dashboard","API access for CMMS integration"],
  };
}


export interface Compressor_energy_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { annual_kwh: number; annual_energy_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Compressor_energy_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["annual_kwh","annual_energy_cost"],
} as const;


// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressor_energy_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.compressor_power_rating + input.motor_efficiency + input.compressor_type; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.compressor_power_rating + input.motor_efficiency + input.compressor_type; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompressor_energy_cost_calculator(input: Compressor_energy_cost_calculatorInput): Compressor_energy_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-compressor optimization","Real-time monitoring integration","Custom reporting dashboard","API access for CMMS integration"],
  };
}


export interface Compressor_energy_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

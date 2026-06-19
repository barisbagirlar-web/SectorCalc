// Auto-generated from voltage-drop-calculator-schema.json
import * as z from 'zod';

export interface Voltage_drop_calculatorInput {
  conductor_material: string;
  conductor_size: string;
  circuit_length: number;
  load_current: number;
  system_voltage: number;
  phase_type: string;
  power_factor: number;
  ambient_temperature: number;
  dataConfidence?: number;
}

export const Voltage_drop_calculatorInputSchema = z.object({
  conductor_material: z.enum(['copper', 'aluminum']).default('copper'),
  conductor_size: z.enum(['14', '12', '10', '8', '6', '4', '2', '1', '1/0', '2/0', '3/0', '4/0', '250', '300', '350', '500']).default('10'),
  circuit_length: z.number().min(1).max(10000).default(100),
  load_current: z.number().min(0.1).max(5000).default(20),
  system_voltage: z.number().min(12).max(35000).default(480),
  phase_type: z.enum(['single_phase', 'three_phase']).default('three_phase'),
  power_factor: z.number().min(0.5).max(1).default(0.85),
  ambient_temperature: z.number().min(-10).max(60).default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Voltage_drop_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.circuit_length * input.load_current * input.system_voltage * input.power_factor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.circuit_length * input.load_current * input.system_voltage * input.power_factor * (input.ambient_temperature); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ambient_temperature; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVoltage_drop_calculator(input: Voltage_drop_calculatorInput): Voltage_drop_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Voltage_drop_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

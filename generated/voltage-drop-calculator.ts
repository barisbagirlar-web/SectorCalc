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

function evaluateAllFormulas(input: Voltage_drop_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = lookup_resistance(input.conductor_material, input.conductor_size); results["resistance_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["resistance_per_unit"] = 0; }
  try { const v = 1 + α * (input.ambient_temperature - 20); results["temperature_correction_factor"] = Number.isFinite(v) ? v : 0; } catch { results["temperature_correction_factor"] = 0; }
  try { const v = R20 * TCF; results["adjusted_resistance"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_resistance"] = 0; }
  try { const v = Math.sqrt(R_adj**2 + X**2); results["effective_impedance"] = Number.isFinite(v) ? v : 0; } catch { results["effective_impedance"] = 0; }
  try { const v = (input.load_current * input.circuit_length * Z * phase_factor) / 1000; results["voltage_drop_volts"] = Number.isFinite(v) ? v : 0; } catch { results["voltage_drop_volts"] = 0; }
  try { const v = (Vd / input.system_voltage) * 100; results["voltage_drop_percent"] = Number.isFinite(v) ? v : 0; } catch { results["voltage_drop_percent"] = 0; }
  try { const v = 2 * (input.load_current**2 * R_adj * input.circuit_length / 1000); results["power_loss"] = Number.isFinite(v) ? v : 0; } catch { results["power_loss"] = 0; }
  return results;
}


export function calculateVoltage_drop_calculator(input: Voltage_drop_calculatorInput): Voltage_drop_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["voltage_drop_percent"] ?? 0;
  const breakdown = {
    resistance_at_20C: values["resistance_at_20C"] ?? 0,
    temperature_correction_factor: values["temperature_correction_factor"] ?? 0,
    adjusted_resistance: values["adjusted_resistance"] ?? 0,
    effective_impedance: values["effective_impedance"] ?? 0,
    voltage_drop_volts: values["voltage_drop_volts"] ?? 0,
    power_loss: values["power_loss"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High conductor resistance","Excessive circuit length","Low power factor","High ambient temperature"];
  const suggestedActions: string[] = ["Increase conductor size","Reduce circuit length","Improve power factor","Use parallel conductors","Switch to copper conductor"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
  breakdown: { resistance_at_20C: number; temperature_correction_factor: number; adjusted_resistance: number; effective_impedance: number; voltage_drop_volts: number; power_loss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

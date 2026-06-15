// Auto-generated from ohms-law-calculator-schema.json
import * as z from 'zod';

export interface Ohms_law_calculatorInput {
  voltage: number;
  current: number;
  resistance: number;
  powerFactor: number;
  phaseType: string;
  temperature: number;
}

export const Ohms_law_calculatorInputSchema = z.object({
  voltage: z.number().min(0).max(1000000).default(230),
  current: z.number().min(0).max(100000).default(10),
  resistance: z.number().min(0).max(1000000000).default(23),
  powerFactor: z.number().min(0).max(1).default(1),
  phaseType: z.enum(['single', 'three']).default('single'),
  temperature: z.number().min(-40).max(85).default(25),
});

function evaluateAllFormulas(input: Ohms_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["resistance_from_v_and_i"] = input.voltage / input.current; } catch { results["resistance_from_v_and_i"] = 0; }
  try { results["current_from_v_and_r"] = input.voltage / input.resistance; } catch { results["current_from_v_and_r"] = 0; }
  try { results["voltage_from_i_and_r"] = input.current * input.resistance; } catch { results["voltage_from_i_and_r"] = 0; }
  try { results["real_power_dc"] = input.voltage * input.current; } catch { results["real_power_dc"] = 0; }
  try { results["real_power_ac"] = (input.phaseType == 'three' ? Math.sqrt(3) : 1) * input.voltage * input.current * input.powerFactor; } catch { results["real_power_ac"] = 0; }
  try { results["apparent_power"] = (input.phaseType == 'three' ? Math.sqrt(3) : 1) * input.voltage * input.current; } catch { results["apparent_power"] = 0; }
  try { results["reactive_power"] = Math.sqrt(apparentPower**2 - realPower**2); } catch { results["reactive_power"] = 0; }
  try { results["power_loss"] = input.current**2 * input.resistance; } catch { results["power_loss"] = 0; }
  try { results["temperature_corrected_resistance"] = input.resistance * (1 + 0.00393 * (input.temperature - 20)); } catch { results["temperature_corrected_resistance"] = 0; }
  return results;
}


export function calculateOhms_law_calculator(input: Ohms_law_calculatorInput): Ohms_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realPower"] ?? 0;
  const breakdown = {
    apparentPower: values["apparentPower"] ?? 0,
    reactivePower: values["reactivePower"] ?? 0,
    powerLoss: values["powerLoss"] ?? 0,
    correctedResistance: values["correctedResistance"] ?? 0,
    powerFactorActual: values["powerFactorActual"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Current","Low Power Factor","High Ambient Temperature","Harmonic Distortion"];
  const suggestedActions: string[] = ["Reduce load current or increase conductor cross-section to lower I²R losses and prevent overheating.","Install power factor correction capacitors to improve power factor above 0.95, reducing apparent power and utility penalties.","Improve ventilation or relocate equipment to cooler area. Consider using higher temperature rated insulation (e.g., 90°C rated cable).","Check voltage regulation at point of common coupling. Voltage deviation >10% may cause equipment malfunction and increased losses.","Perform harmonic analysis. Install passive or active harmonic filters to reduce THD and improve system efficiency."];
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


export interface Ohms_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: { apparentPower: number; reactivePower: number; powerLoss: number; correctedResistance: number; powerFactorActual: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

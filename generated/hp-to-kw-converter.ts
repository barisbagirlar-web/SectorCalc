// Auto-generated from hp-to-kw-converter-schema.json
import * as z from 'zod';

export interface Hp_to_kw_converterInput {
  horsepower: number;
  hp_type: string;
  motor_efficiency: number;
  load_factor: number;
  power_factor: number;
  operating_hours_per_year: number;
  electricity_cost_per_kwh: number;
}

export const Hp_to_kw_converterInputSchema = z.object({
  horsepower: z.number().min(0.1).max(10000).default(100),
  hp_type: z.enum(['mechanical', 'metric', 'electrical']).default('mechanical'),
  motor_efficiency: z.number().min(50).max(99.9).default(90),
  load_factor: z.number().min(10).max(100).default(100),
  power_factor: z.number().min(0.5).max(1).default(0.85),
  operating_hours_per_year: z.number().min(0).max(8760).default(8000),
  electricity_cost_per_kwh: z.number().min(0.01).max(1).default(0.12),
});

function evaluateAllFormulas(input: Hp_to_kw_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["conversion_factor"] = (input.hp_type === 'mechanical' ? 0.7457 : (input.hp_type === 'metric' ? 0.7355 : (input.hp_type === 'electrical' ? 0.746 : 0))); } catch { results["conversion_factor"] = 0; }
  try { results["input_power_kw"] = input.horsepower * (results["conversion_factor"] ?? 0); } catch { results["input_power_kw"] = 0; }
  try { results["electrical_input_power"] = ((results["input_power_kw"] ?? 0) / (input.motor_efficiency / 100)) * (input.load_factor / 100); } catch { results["electrical_input_power"] = 0; }
  try { results["apparent_power_kva"] = (results["electrical_input_power"] ?? 0) / input.power_factor; } catch { results["apparent_power_kva"] = 0; }
  try { results["annual_energy_consumption"] = (results["electrical_input_power"] ?? 0) * input.operating_hours_per_year; } catch { results["annual_energy_consumption"] = 0; }
  try { results["annual_energy_cost"] = (results["annual_energy_consumption"] ?? 0) * input.electricity_cost_per_kwh; } catch { results["annual_energy_cost"] = 0; }
  try { results["primary_result"] = (results["input_power_kw"] ?? 0) * (input.load_factor / 100); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateHp_to_kw_converter(input: Hp_to_kw_converterInput): Hp_to_kw_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["equivalent_kw"] ?? 0;
  const breakdown = {
    input_hp: values["input_hp"] ?? 0,
    conversion_factor_used: values["conversion_factor_used"] ?? 0,
    shaft_power_kw: values["shaft_power_kw"] ?? 0,
    electrical_input_power: values["electrical_input_power"] ?? 0,
    apparent_power: values["apparent_power"] ?? 0,
    annual_energy_consumption: values["annual_energy_consumption"] ?? 0,
    annual_energy_cost: values["annual_energy_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["I²R losses in stator and rotor windings","Hysteresis and eddy current losses in iron core","Bearing friction and air resistance","Leakage flux and harmonic losses"];
  const suggestedActions: string[] = ["Consider replacing motor with a smaller, more efficient unit to match actual load.","Install power factor correction capacitors to reduce reactive power and avoid utility penalties.","Replace motor with IE4 (Super Premium Efficiency) class motor.","Install variable frequency drive to match motor speed to load requirements."];
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


export interface Hp_to_kw_converterOutput {
  totalWasteCost: number;
  breakdown: { input_hp: number; conversion_factor_used: number; shaft_power_kw: number; electrical_input_power: number; apparent_power: number; annual_energy_consumption: number; annual_energy_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

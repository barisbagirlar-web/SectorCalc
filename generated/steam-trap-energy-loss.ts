// Auto-generated from steam-trap-energy-loss-schema.json
import * as z from 'zod';

export interface Steam_trap_energy_lossInput {
  orifice_diameter: number;
  steam_pressure: number;
  operating_hours_per_year: number;
  steam_cost: number;
  trap_type: string;
  failure_mode: string;
  condensate_recovery: boolean;
}

export const Steam_trap_energy_lossInputSchema = z.object({
  orifice_diameter: z.number().min(0.5).max(25).default(3),
  steam_pressure: z.number().min(0.5).max(30).default(7),
  operating_hours_per_year: z.number().min(1000).max(8760).default(8000),
  steam_cost: z.number().min(5).max(100).default(25),
  trap_type: z.enum(['Float & Thermostatic', 'Thermodynamic', 'Inverted Bucket', 'Thermostatic', 'Orifice']).default('Float & Thermostatic'),
  failure_mode: z.enum(['Blow-through (fully open)', 'Leaking (partially open)', 'Blow-through (fully open)']).default('Blow-through (fully open)'),
  condensate_recovery: z.boolean().default(true),
});

function evaluateAllFormulas(input: Steam_trap_energy_lossInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_orifice_area"] = (π * (input.orifice_diameter/1000)**2 / 4) * F_mode; } catch { results["effective_orifice_area"] = 0; }
  try { results["steam_flow_rate"] = 0.525 * A * (P_abs + 1.013) / Math.sqrt(273 + 170); } catch { results["steam_flow_rate"] = 0; }
  try { results["annual_steam_loss_mass"] = m_dot * input.operating_hours_per_year * 3600; } catch { results["annual_steam_loss_mass"] = 0; }
  try { results["energy_loss_kwh"] = M_annual * h_fg / 3600; } catch { results["energy_loss_kwh"] = 0; }
  try { results["condensate_adjustment"] = E_loss * (1 - 0.2 * input.condensate_recovery); } catch { results["condensate_adjustment"] = 0; }
  try { results["cost_loss"] = (M_annual / 1000) * input.steam_cost; } catch { results["cost_loss"] = 0; }
  try { results["co2_emissions"] = E_net * 0.2; } catch { results["co2_emissions"] = 0; }
  return results;
}


export function calculateSteam_trap_energy_loss(input: Steam_trap_energy_lossInput): Steam_trap_energy_lossOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost_loss"] ?? 0;
  const breakdown = {
    energy_loss_kwh: values["energy_loss_kwh"] ?? 0,
    steam_loss_tonnes: values["steam_loss_tonnes"] ?? 0,
    cost_loss: values["cost_loss"] ?? 0,
    co2_emissions: values["co2_emissions"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Orifice Diameter","Steam Pressure","Operating Hours","Failure Mode"];
  const suggestedActions: string[] = ["Replace failed trap immediately","Conduct system-wide steam trap survey","Install continuous monitoring on critical traps","Improve condensate recovery system"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated report scheduling"],
  };
}


export interface Steam_trap_energy_lossOutput {
  totalWasteCost: number;
  breakdown: { energy_loss_kwh: number; steam_loss_tonnes: number; cost_loss: number; co2_emissions: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

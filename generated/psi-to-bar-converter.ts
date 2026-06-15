// Auto-generated from psi-to-bar-converter-schema.json
import * as z from 'zod';

export interface Psi_to_bar_converterInput {
  pressure_psi: number;
  temperature_celsius: number;
  altitude_meters: number;
  fluid_type: string;
  include_temperature_correction: boolean;
  include_altitude_correction: boolean;
}

export const Psi_to_bar_converterInputSchema = z.object({
  pressure_psi: z.number().min(0).max(100000).default(0),
  temperature_celsius: z.number().min(-40).max(200).default(20),
  altitude_meters: z.number().min(-500).max(10000).default(0),
  fluid_type: z.enum(['water', 'oil', 'gas', 'steam']).default('water'),
  include_temperature_correction: z.boolean().default(true),
  include_altitude_correction: z.boolean().default(false),
});

function evaluateAllFormulas(input: Psi_to_bar_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["base_conversion"] = input.pressure_psi * 0.0689476; } catch { results["base_conversion"] = 0; }
  try { results["temperature_correction_factor"] = 1 + (input.temperature_celsius - 20) * 0.000036; } catch { results["temperature_correction_factor"] = 0; }
  try { results["altitude_correction_factor"] = exp(-input.altitude_meters / 8430); } catch { results["altitude_correction_factor"] = 0; }
  results["fluid_density_factor"] = 0;
  try { results["corrected_bar"] = base_bar * (input.include_temperature_correction ? temp_factor : 1) * (input.include_altitude_correction ? alt_factor : 1) * density_factor; } catch { results["corrected_bar"] = 0; }
  try { results["data_confidence"] = 1.0 - (input.include_temperature_correction ? 0.05 : 0) - (input.include_altitude_correction ? 0.05 : 0) - (input.fluid_type != 'water' ? 0.02 : 0) - (input.pressure_psi == 0 ? 0.1 : 0); } catch { results["data_confidence"] = 0; }
  try { results["primary_result"] = (results["corrected_bar"] ?? 0) * confidence; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculatePsi_to_bar_converter(input: Psi_to_bar_converterInput): Psi_to_bar_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_bar"] ?? 0;
  const breakdown = {
    base_bar: values["base_bar"] ?? 0,
    temp_factor: values["temp_factor"] ?? 0,
    alt_factor: values["alt_factor"] ?? 0,
    density_factor: values["density_factor"] ?? 0,
    corrected_bar: values["corrected_bar"] ?? 0,
    confidence: values["confidence"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Uncorrected Temperature Drift","Uncorrected Altitude Error","Fluid Density Mismatch","Sensor Calibration Drift"];
  const suggestedActions: string[] = ["Enable Temperature Correction","Enable Altitude Correction","Verify Fluid Type","Schedule Sensor Calibration","Document Measurement Uncertainty"];
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


export interface Psi_to_bar_converterOutput {
  totalWasteCost: number;
  breakdown: { base_bar: number; temp_factor: number; alt_factor: number; density_factor: number; corrected_bar: number; confidence: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

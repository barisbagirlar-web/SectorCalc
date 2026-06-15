// Auto-generated from compressor-tank-sizing-calculator-schema.json
import * as z from 'zod';

export interface Compressor_tank_sizing_calculatorInput {
  compressorFlowRate: number;
  demandFlowRate: number;
  peakDemandFlowRate: number;
  peakDuration: number;
  systemPressure: number;
  pressureDifferential: number;
  compressorControlType: string;
  ambientTemperature: number;
  altitude: number;
  systemLeakagePercent: number;
  applicationType: string;
}

export const Compressor_tank_sizing_calculatorInputSchema = z.object({
  compressorFlowRate: z.number().min(10).max(10000).default(100),
  demandFlowRate: z.number().min(5).max(9500).default(80),
  peakDemandFlowRate: z.number().min(10).max(15000).default(150),
  peakDuration: z.number().min(1).max(600).default(30),
  systemPressure: z.number().min(30).max(250).default(100),
  pressureDifferential: z.number().min(1).max(50).default(10),
  compressorControlType: z.enum(['Load/Unload', 'Variable Speed Drive (VSD)', 'Modulating', 'Start/Stop']).default('Load/Unload'),
  ambientTemperature: z.number().min(-20).max(130).default(80),
  altitude: z.number().min(0).max(10000).default(0),
  systemLeakagePercent: z.number().min(0).max(50).default(10),
  applicationType: z.enum(['General Manufacturing', 'Pneumatic Tools', 'Instrument Air', 'Process Air', 'HVAC Control']).default('General Manufacturing'),
});

function evaluateAllFormulas(input: Compressor_tank_sizing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["airDensityCorrectionFactor"] = ( (520 / (input.ambientTemperature + 460)) * ( (14.7) / (14.7 - (input.altitude * 0.0005)) ) ); } catch { results["airDensityCorrectionFactor"] = 0; }
  try { results["effectiveCompressorFlow"] = input.compressorFlowRate * (1 - input.systemLeakagePercent/100) * K_density; } catch { results["effectiveCompressorFlow"] = 0; }
  try { results["netPeakSurplus"] = Math.max(0, input.peakDemandFlowRate - (results["effectiveCompressorFlow"] ?? 0)); } catch { results["netPeakSurplus"] = 0; }
  try { results["requiredTankVolumeStandard"] = (Q_peak_surplus * input.peakDuration * 14.7) / (input.pressureDifferential * 60); } catch { results["requiredTankVolumeStandard"] = 0; }
  results["controlTypeFactor"] = 0;
  results["applicationSafetyFactor"] = 0;
  try { results["calculatedTankSize"] = V_tank_std * F_ctrl * F_safe; } catch { results["calculatedTankSize"] = 0; }
  return results;
}


export function calculateCompressor_tank_sizing_calculator(input: Compressor_tank_sizing_calculatorInput): Compressor_tank_sizing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calculatedTankSize"] ?? 0;
  const breakdown = {
    airDensityCorrectionFactor: values["airDensityCorrectionFactor"] ?? 0,
    effectiveCompressorFlow: values["effectiveCompressorFlow"] ?? 0,
    netPeakSurplus: values["netPeakSurplus"] ?? 0,
    requiredTankVolumeStandard: values["requiredTankVolumeStandard"] ?? 0,
    controlTypeFactor: values["controlTypeFactor"] ?? 0,
    applicationSafetyFactor: values["applicationSafetyFactor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Leakage Loss","Pressure Drop Loss","Peak-to-Average Demand Ratio"];
  const suggestedActions: string[] = ["Implement a leak detection and repair program to reduce leakage below 10%.","Consider upgrading to Variable Speed Drive (VSD) compressor to reduce tank size and energy costs.","If system allows, increase allowable pressure differential to reduce tank size.","Conduct a detailed demand study to confirm peak magnitude and duration."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom report branding"],
  };
}


export interface Compressor_tank_sizing_calculatorOutput {
  totalWasteCost: number;
  breakdown: { airDensityCorrectionFactor: number; effectiveCompressorFlow: number; netPeakSurplus: number; requiredTankVolumeStandard: number; controlTypeFactor: number; applicationSafetyFactor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

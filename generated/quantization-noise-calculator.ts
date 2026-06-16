// Auto-generated from quantization-noise-calculator-schema.json
import * as z from 'zod';

export interface Quantization_noise_calculatorInput {
  voltageRange: number;
  bits: number;
  signalAmplitudePeak: number;
  loadResistance: number;
}

export const Quantization_noise_calculatorInputSchema = z.object({
  voltageRange: z.number().default(5),
  bits: z.number().default(12),
  signalAmplitudePeak: z.number().default(2.5),
  loadResistance: z.number().default(50),
});

function evaluateAllFormulas(input: Quantization_noise_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltageRange / (2**input.bits); results["step_V"] = Number.isFinite(v) ? v : 0; } catch { results["step_V"] = 0; }
  try { const v = (input.voltageRange / (2**input.bits))**2 / 12; results["noise_power_V2"] = Number.isFinite(v) ? v : 0; } catch { results["noise_power_V2"] = 0; }
  try { const v = Math.sqrt((input.voltageRange / (2**input.bits))**2 / 12); results["noise_RMS_V"] = Number.isFinite(v) ? v : 0; } catch { results["noise_RMS_V"] = 0; }
  try { const v = (input.signalAmplitudePeak**2) / 2; results["signal_power_V2"] = Number.isFinite(v) ? v : 0; } catch { results["signal_power_V2"] = 0; }
  try { const v = 10 * Math.log10(((input.signalAmplitudePeak**2) / 2) / ((input.voltageRange / (2**input.bits))**2 / 12)); results["SQNR_dB"] = Number.isFinite(v) ? v : 0; } catch { results["SQNR_dB"] = 0; }
  try { const v = 10 * Math.log10((((input.voltageRange / (2**input.bits))**2 / 12) / input.loadResistance) / 0.001); results["noise_power_dBm"] = Number.isFinite(v) ? v : 0; } catch { results["noise_power_dBm"] = 0; }
  return results;
}


export function calculateQuantization_noise_calculator(input: Quantization_noise_calculatorInput): Quantization_noise_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["SQNR_dB"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumFeatures: [],
  };
}


export interface Quantization_noise_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

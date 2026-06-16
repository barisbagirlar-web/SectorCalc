// Auto-generated from snr-calculator-schema.json
import * as z from 'zod';

export interface Snr_calculatorInput {
  signalVoltage: number;
  loadResistance: number;
  bandwidth: number;
  temperature: number;
  noiseFigure: number;
}

export const Snr_calculatorInputSchema = z.object({
  signalVoltage: z.number().default(1),
  loadResistance: z.number().default(50),
  bandwidth: z.number().default(1000000),
  temperature: z.number().default(290),
  noiseFigure: z.number().default(0),
});

function evaluateAllFormulas(input: Snr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(4 * 1.380649e-23 * input.temperature * input.bandwidth * input.loadResistance); results["noiseVoltageThermal"] = Number.isFinite(v) ? v : 0; } catch { results["noiseVoltageThermal"] = 0; }
  try { const v = 10 ** (input.noiseFigure / 10); results["noiseFactor"] = Number.isFinite(v) ? v : 0; } catch { results["noiseFactor"] = 0; }
  try { const v = (results["noiseVoltageThermal"] ?? 0) * Math.sqrt((results["noiseFactor"] ?? 0)); results["totalNoiseVoltage"] = Number.isFinite(v) ? v : 0; } catch { results["totalNoiseVoltage"] = 0; }
  try { const v = input.signalVoltage / (results["totalNoiseVoltage"] ?? 0); results["snrLinear"] = Number.isFinite(v) ? v : 0; } catch { results["snrLinear"] = 0; }
  try { const v = 20 * Math.log10((results["snrLinear"] ?? 0)); results["snr_dB"] = Number.isFinite(v) ? v : 0; } catch { results["snr_dB"] = 0; }
  return results;
}


export function calculateSnr_calculator(input: Snr_calculatorInput): Snr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["snr_dB"] ?? 0;
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


export interface Snr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

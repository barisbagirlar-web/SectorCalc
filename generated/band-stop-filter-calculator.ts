// Auto-generated from band-stop-filter-calculator-schema.json
import * as z from 'zod';

export interface Band_stop_filter_calculatorInput {
  centerFrequency: number;
  lowerCutoffFrequency: number;
  upperCutoffFrequency: number;
  evaluationFrequency: number;
}

export const Band_stop_filter_calculatorInputSchema = z.object({
  centerFrequency: z.number().default(1000),
  lowerCutoffFrequency: z.number().default(900),
  upperCutoffFrequency: z.number().default(1100),
  evaluationFrequency: z.number().default(800),
});

function evaluateAllFormulas(input: Band_stop_filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.centerFrequency / (input.upperCutoffFrequency - input.lowerCutoffFrequency); results["qFactor"] = Number.isFinite(v) ? v : 0; } catch { results["qFactor"] = 0; }
  try { const v = 2 * Math.PI * input.centerFrequency; results["w0"] = Number.isFinite(v) ? v : 0; } catch { results["w0"] = 0; }
  try { const v = 2 * Math.PI * input.evaluationFrequency; results["w"] = Number.isFinite(v) ? v : 0; } catch { results["w"] = 0; }
  try { const v = Math.abs((results["w0"] ?? 0) * (results["w0"] ?? 0) - (results["w"] ?? 0) * (results["w"] ?? 0)) / Math.sqrt(Math.pow((results["w0"] ?? 0) * (results["w0"] ?? 0) - (results["w"] ?? 0) * (results["w"] ?? 0), 2) + Math.pow(((results["w"] ?? 0) * (results["w0"] ?? 0)) / (results["qFactor"] ?? 0), 2)); results["linearGain"] = Number.isFinite(v) ? v : 0; } catch { results["linearGain"] = 0; }
  try { const v = 20 * Math.log10((results["linearGain"] ?? 0)); results["attenuation_dB"] = Number.isFinite(v) ? v : 0; } catch { results["attenuation_dB"] = 0; }
  try { const v = Math.atan2(- ((results["w"] ?? 0) * (results["w0"] ?? 0)) / (results["qFactor"] ?? 0), (results["w0"] ?? 0) * (results["w0"] ?? 0) - (results["w"] ?? 0) * (results["w"] ?? 0)); results["phaseShift_rad"] = Number.isFinite(v) ? v : 0; } catch { results["phaseShift_rad"] = 0; }
  return results;
}


export function calculateBand_stop_filter_calculator(input: Band_stop_filter_calculatorInput): Band_stop_filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["attenuation_dB"] ?? 0;
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


export interface Band_stop_filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

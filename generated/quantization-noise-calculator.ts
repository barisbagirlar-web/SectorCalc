// Auto-generated from quantization-noise-calculator-schema.json
import * as z from 'zod';

export interface Quantization_noise_calculatorInput {
  voltageRange: number;
  bits: number;
  signalAmplitudePeak: number;
  loadResistance: number;
  dataConfidence?: number;
}

export const Quantization_noise_calculatorInputSchema = z.object({
  voltageRange: z.number().default(5),
  bits: z.number().default(12),
  signalAmplitudePeak: z.number().default(2.5),
  loadResistance: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quantization_noise_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltageRange / (2**input.bits); results["step_V"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["step_V"] = Number.NaN; }
  try { const v = (input.voltageRange / (2**input.bits))**2 / 12; results["noise_power_V2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["noise_power_V2"] = Number.NaN; }
  try { const v = (input.signalAmplitudePeak**2) / 2; results["signal_power_V2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["signal_power_V2"] = Number.NaN; }
  return results;
}


export function calculateQuantization_noise_calculator(input: Quantization_noise_calculatorInput): Quantization_noise_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["signal_power_V2"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

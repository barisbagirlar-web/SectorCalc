// Auto-generated from adc-calculator-schema.json
import * as z from 'zod';

export interface Adc_calculatorInput {
  resolutionBits: number;
  referenceVoltage: number;
  inputVoltage: number;
  gain: number;
}

export const Adc_calculatorInputSchema = z.object({
  resolutionBits: z.number().default(12),
  referenceVoltage: z.number().default(3.3),
  inputVoltage: z.number().default(1.65),
  gain: z.number().default(1),
});

function evaluateAllFormulas(input: Adc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.referenceVoltage / Math.pow(2, input.resolutionBits); results["lsb"] = Number.isFinite(v) ? v : 0; } catch { results["lsb"] = 0; }
  try { const v = Math.floor((input.inputVoltage * input.gain) / input.referenceVoltage * Math.pow(2, input.resolutionBits)); results["digitalCode"] = Number.isFinite(v) ? v : 0; } catch { results["digitalCode"] = 0; }
  try { const v = (input.inputVoltage * input.gain) - Math.floor((input.inputVoltage * input.gain) / input.referenceVoltage * Math.pow(2, input.resolutionBits)) * (input.referenceVoltage / Math.pow(2, input.resolutionBits)); results["quantizationError"] = Number.isFinite(v) ? v : 0; } catch { results["quantizationError"] = 0; }
  try { const v = Math.floor((input.inputVoltage * input.gain) / input.referenceVoltage * Math.pow(2, input.resolutionBits)) * (input.referenceVoltage / Math.pow(2, input.resolutionBits)); results["reconvertedVoltage"] = Number.isFinite(v) ? v : 0; } catch { results["reconvertedVoltage"] = 0; }
  return results;
}


export function calculateAdc_calculator(input: Adc_calculatorInput): Adc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["digitalCode"] ?? 0;
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


export interface Adc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from compressor-calculator-schema.json
import * as z from 'zod';

export interface Compressor_calculatorInput {
  inletPressure: number;
  outletPressure: number;
  flowRate: number;
  adiabaticIndex: number;
  compressorEfficiency: number;
  motorEfficiency: number;
}

export const Compressor_calculatorInputSchema = z.object({
  inletPressure: z.number().default(1),
  outletPressure: z.number().default(8),
  flowRate: z.number().default(10),
  adiabaticIndex: z.number().default(1.4),
  compressorEfficiency: z.number().default(80),
  motorEfficiency: z.number().default(95),
});

function evaluateAllFormulas(input: Compressor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.inletPressure * 100000) * (input.flowRate / 60) * (input.adiabaticIndex / (input.adiabaticIndex - 1)) * (Math.pow(input.outletPressure / input.inletPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / 1000; results["adiabaticPower"] = Number.isFinite(v) ? v : 0; } catch { results["adiabaticPower"] = 0; }
  try { const v = (((input.inletPressure * 100000) * (input.flowRate / 60) * (input.adiabaticIndex / (input.adiabaticIndex - 1)) * (Math.pow(input.outletPressure / input.inletPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / 1000) / (input.compressorEfficiency / 100); results["shaftPower"] = Number.isFinite(v) ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = ((((input.inletPressure * 100000) * (input.flowRate / 60) * (input.adiabaticIndex / (input.adiabaticIndex - 1)) * (Math.pow(input.outletPressure / input.inletPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / 1000) / (input.compressorEfficiency / 100)) / (input.motorEfficiency / 100); results["motorInputPower"] = Number.isFinite(v) ? v : 0; } catch { results["motorInputPower"] = 0; }
  try { const v = input.outletPressure / input.inletPressure; results["pressureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["pressureRatio"] = 0; }
  return results;
}


export function calculateCompressor_calculator(input: Compressor_calculatorInput): Compressor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Motor"] ?? 0;
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


export interface Compressor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from compressor-calculator-schema.json
import * as z from 'zod';

export interface Compressor_calculatorInput {
  inletPressure: number;
  outletPressure: number;
  flowRate: number;
  adiabaticIndex: number;
  compressorEfficiency: number;
  motorEfficiency: number;
  dataConfidence?: number;
}

export const Compressor_calculatorInputSchema = z.object({
  inletPressure: z.number().default(1),
  outletPressure: z.number().default(8),
  flowRate: z.number().default(10),
  adiabaticIndex: z.number().default(1.4),
  compressorEfficiency: z.number().default(80),
  motorEfficiency: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outletPressure / input.inletPressure; results["pressureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = input.flowRate * input.inletPressure * 100 * ((asFormulaNumber(results["pressureRatio"])) ^ ((input.adiabaticIndex - 1) / input.adiabaticIndex) - 1) / (input.adiabaticIndex - 1) / 60; results["adiabaticPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adiabaticPower"] = 0; }
  try { const v = (asFormulaNumber(results["adiabaticPower"])) / (input.compressorEfficiency / 100); results["shaftPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = (asFormulaNumber(results["shaftPower"])) / (input.motorEfficiency / 100); results["motorPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["motorPower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompressor_calculator(input: Compressor_calculatorInput): Compressor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressureRatio"]);
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


export interface Compressor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

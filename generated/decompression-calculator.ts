// Auto-generated from decompression-calculator-schema.json
import * as z from 'zod';

export interface Decompression_calculatorInput {
  initialPressure: number;
  finalPressure: number;
  volume: number;
  flowRate: number;
  temperature: number;
  dataConfidence?: number;
}

export const Decompression_calculatorInputSchema = z.object({
  initialPressure: z.number().default(200),
  finalPressure: z.number().default(1),
  volume: z.number().default(1000),
  flowRate: z.number().default(50),
  temperature: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Decompression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialPressure - input.finalPressure; results["pressureDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureDifference"] = 0; }
  try { const v = ((asFormulaNumber(results["pressureDifference"])) * input.volume) / input.flowRate; results["timeUncorrected"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timeUncorrected"] = 0; }
  try { const v = input.temperature + 273.15; results["temperatureKelvin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["temperatureKelvin"] = 0; }
  try { const v = (asFormulaNumber(results["timeUncorrected"])) * ((asFormulaNumber(results["temperatureKelvin"])) / 293.15); results["decompressionTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["decompressionTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDecompression_calculator(input: Decompression_calculatorInput): Decompression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decompressionTime"]);
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


export interface Decompression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

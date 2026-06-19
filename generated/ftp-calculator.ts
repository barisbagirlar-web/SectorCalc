// Auto-generated from ftp-calculator-schema.json
import * as z from 'zod';

export interface Ftp_calculatorInput {
  testDuration: number;
  averagePower: number;
  weight: number;
  ambientTemperature: number;
  dataConfidence?: number;
}

export const Ftp_calculatorInputSchema = z.object({
  testDuration: z.number().default(20),
  averagePower: z.number().default(200),
  weight: z.number().default(70),
  ambientTemperature: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ftp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.testDuration * input.averagePower * input.weight * input.ambientTemperature; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.testDuration * input.averagePower * input.weight * input.ambientTemperature; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFtp_calculator(input: Ftp_calculatorInput): Ftp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Ftp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

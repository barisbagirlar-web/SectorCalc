// Auto-generated from ftp-calculator-schema.json
import * as z from 'zod';

export interface Ftp_calculatorInput {
  testDuration: number;
  averagePower: number;
  weight: number;
  ambientTemperature: number;
}

export const Ftp_calculatorInputSchema = z.object({
  testDuration: z.number().default(20),
  averagePower: z.number().default(200),
  weight: z.number().default(70),
  ambientTemperature: z.number().default(20),
});

function evaluateAllFormulas(input: Ftp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(1, 0.95 + 0.00125 * Math.max(0, input.testDuration - 20)); results["adjFactor"] = Number.isFinite(v) ? v : 0; } catch { results["adjFactor"] = 0; }
  try { const v = 1 - 0.005 * Math.max(0, input.ambientTemperature - 20); results["tempCorrection"] = Number.isFinite(v) ? v : 0; } catch { results["tempCorrection"] = 0; }
  try { const v = (results["adjFactor"] ?? 0) * (results["tempCorrection"] ?? 0); results["overallFactor"] = Number.isFinite(v) ? v : 0; } catch { results["overallFactor"] = 0; }
  try { const v = input.averagePower * (results["overallFactor"] ?? 0); results["FTP"] = Number.isFinite(v) ? v : 0; } catch { results["FTP"] = 0; }
  try { const v = (results["FTP"] ?? 0) / input.weight; results["powerToWeight"] = Number.isFinite(v) ? v : 0; } catch { results["powerToWeight"] = 0; }
  results["Power_to_Weight_Ratio__W_kg_"] = 0;
  results["Overall_Adjustment_Factor"] = 0;
  try { const v = (results["FTP"] ?? 0) (W); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateFtp_calculator(input: Ftp_calculatorInput): Ftp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Ftp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

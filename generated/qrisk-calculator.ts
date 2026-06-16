// Auto-generated from qrisk-calculator-schema.json
import * as z from 'zod';

export interface Qrisk_calculatorInput {
  age: number;
  systolicBP: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  smoker: number;
  diabetes: number;
}

export const Qrisk_calculatorInputSchema = z.object({
  age: z.number().default(50),
  systolicBP: z.number().default(120),
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  smoker: z.number().default(0),
  diabetes: z.number().default(0),
});

function evaluateAllFormulas(input: Qrisk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -5.5 + 0.05 * input.age + 0.01 * input.systolicBP + 0.005 * input.totalCholesterol - 0.008 * input.hdlCholesterol + 0.5 * input.smoker + 0.3 * input.diabetes; results["beta"] = Number.isFinite(v) ? v : 0; } catch { results["beta"] = 0; }
  try { const v = 1 - Math.exp(-Math.exp((results["beta"] ?? 0))); results["risk"] = Number.isFinite(v) ? v : 0; } catch { results["risk"] = 0; }
  try { const v = (results["risk"] ?? 0) * 100; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  return results;
}


export function calculateQrisk_calculator(input: Qrisk_calculatorInput): Qrisk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentage"] ?? 0;
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


export interface Qrisk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

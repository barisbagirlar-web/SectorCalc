// Auto-generated from bar-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Bar_to_psi_calculatorInput {
  pressureBar: number;
  refType: number;
  atmBar: number;
  precision: number;
  conversionFactor: number;
  tempC: number;
}

export const Bar_to_psi_calculatorInputSchema = z.object({
  pressureBar: z.number().default(1),
  refType: z.number().default(1),
  atmBar: z.number().default(1.01325),
  precision: z.number().default(2),
  conversionFactor: z.number().default(14.503773773),
  tempC: z.number().default(20),
});

function evaluateAllFormulas(input: Bar_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.refType === 1 ? (input.pressureBar + input.atmBar) : input.pressureBar); results["absoluteBar"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteBar"] = 0; }
  try { const v = (results["absoluteBar"] ?? 0) * input.conversionFactor; results["exactPsi"] = Number.isFinite(v) ? v : 0; } catch { results["exactPsi"] = 0; }
  try { const v = Math.round((results["exactPsi"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["psi"] = Number.isFinite(v) ? v : 0; } catch { results["psi"] = 0; }
  return results;
}


export function calculateBar_to_psi_calculator(input: Bar_to_psi_calculatorInput): Bar_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["psi"] ?? 0;
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


export interface Bar_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

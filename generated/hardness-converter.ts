// Auto-generated from hardness-converter-schema.json
import * as z from 'zod';

export interface Hardness_converterInput {
  hardnessValue: number;
  scaleFrom: number;
}

export const Hardness_converterInputSchema = z.object({
  hardnessValue: z.number().default(0),
  scaleFrom: z.number().default(1),
});

function evaluateAllFormulas(input: Hardness_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scaleFrom == 1 ? (Math.sqrt(input.hardnessValue) * 1.5 - 10) : (input.scaleFrom == 2 ? input.hardnessValue : (input.scaleFrom == 3 ? (input.hardnessValue / 30 * 1.2) : (input.scaleFrom == 4 ? (input.hardnessValue * 0.8 - 20) : (input.scaleFrom == 5 ? (input.hardnessValue * 0.9 - 15) : 0)))); results["HRC"] = Number.isFinite(v) ? v : 0; } catch { results["HRC"] = 0; }
  try { const v = input.scaleFrom == 1 ? input.hardnessValue : (input.scaleFrom == 2 ? Math.pow((input.hardnessValue + 10) / 1.5, 2) : (input.scaleFrom == 3 ? input.hardnessValue * 0.8 : (input.scaleFrom == 4 ? (input.hardnessValue + 20) / 0.8 : (input.scaleFrom == 5 ? (input.hardnessValue + 15) / 0.9 : 0)))); results["HB"] = Number.isFinite(v) ? v : 0; } catch { results["HB"] = 0; }
  try { const v = input.scaleFrom == 1 ? input.hardnessValue / 0.8 : (input.scaleFrom == 2 ? (input.hardnessValue / 1.2) * 30 : (input.scaleFrom == 3 ? input.hardnessValue : (input.scaleFrom == 4 ? (input.hardnessValue * 0.7 + 10) * 30 : (input.scaleFrom == 5 ? (input.hardnessValue * 0.8 + 12) * 30 : 0)))); results["HV"] = Number.isFinite(v) ? v : 0; } catch { results["HV"] = 0; }
  try { const v = input.scaleFrom == 1 ? (input.hardnessValue * 0.8 - 20) : (input.scaleFrom == 2 ? input.hardnessValue : (input.scaleFrom == 3 ? (input.hardnessValue / 30 * 0.7 + 10) : (input.scaleFrom == 4 ? input.hardnessValue : (input.scaleFrom == 5 ? input.hardnessValue * 1.1 + 5 : 0)))); results["HRB"] = Number.isFinite(v) ? v : 0; } catch { results["HRB"] = 0; }
  try { const v = input.scaleFrom == 1 ? (input.hardnessValue * 0.9 - 15) : (input.scaleFrom == 2 ? input.hardnessValue : (input.scaleFrom == 3 ? (input.hardnessValue / 30 * 0.8 + 12) : (input.scaleFrom == 4 ? (input.hardnessValue - 5) / 1.1 : (input.scaleFrom == 5 ? input.hardnessValue : 0)))); results["HRA"] = Number.isFinite(v) ? v : 0; } catch { results["HRA"] = 0; }
  return results;
}


export function calculateHardness_converter(input: Hardness_converterInput): Hardness_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["HRC"] ?? 0;
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


export interface Hardness_converterOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

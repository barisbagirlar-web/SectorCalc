// Auto-generated from hardness-converter-schema.json
import * as z from 'zod';

export interface Hardness_converterInput {
  hardnessValue: number;
  scaleFrom: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Hardness_converterInputSchema = z.object({
  hardnessValue: z.number().default(0),
  scaleFrom: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hardness_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scaleFrom == 1 ? input.hardnessValue / 0.8 : (input.scaleFrom == 2 ? (input.hardnessValue / 1.2) * 30 : (input.scaleFrom == 3 ? input.hardnessValue : (input.scaleFrom == 4 ? (input.hardnessValue * 0.7 + 10) * 30 : (input.scaleFrom == 5 ? (input.hardnessValue * 0.8 + 12) * 30 : 0)))); results["HV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HV"] = Number.NaN; }
  try { const v = input.scaleFrom == 1 ? (input.hardnessValue * 0.8 - 20) : (input.scaleFrom == 2 ? input.hardnessValue : (input.scaleFrom == 3 ? (input.hardnessValue / 30 * 0.7 + 10) : (input.scaleFrom == 4 ? input.hardnessValue : (input.scaleFrom == 5 ? input.hardnessValue * 1.1 + 5 : 0)))); results["HRB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HRB"] = Number.NaN; }
  try { const v = input.scaleFrom == 1 ? (input.hardnessValue * 0.9 - 15) : (input.scaleFrom == 2 ? input.hardnessValue : (input.scaleFrom == 3 ? (input.hardnessValue / 30 * 0.8 + 12) : (input.scaleFrom == 4 ? (input.hardnessValue - 5) / 1.1 : (input.scaleFrom == 5 ? input.hardnessValue : 0)))); results["HRA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HRA"] = Number.NaN; }
  return results;
}


export function calculateHardness_converter(input: Hardness_converterInput): Hardness_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["HRA"]);
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


export interface Hardness_converterOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

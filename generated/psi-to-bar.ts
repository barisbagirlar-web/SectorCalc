// Auto-generated from psi-to-bar-schema.json
import * as z from 'zod';

export interface Psi_to_barInput {
  psi_value: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Psi_to_barInputSchema = z.object({
  psi_value: z.number().default(14.5038),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Psi_to_barInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.psi_value / 14.5038; results["bar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bar"] = 0; }
  try { const v = input.psi_value / 14.5038; results["bar_copy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bar_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePsi_to_bar(input: Psi_to_barInput): Psi_to_barOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bar"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Psi_to_barOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

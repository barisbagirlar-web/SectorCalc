// Auto-generated from psi-to-bar-schema.json
import * as z from 'zod';

export interface Psi_to_barInput {
  psi_value: number;
  auto_input_2: number;
  auto_input_3: number;
}

export const Psi_to_barInputSchema = z.object({
  psi_value: z.number().default(14.5038),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Psi_to_barInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.psi_value / 14.5038; results["bar"] = Number.isFinite(v) ? v : 0; } catch { results["bar"] = 0; }
  try { const v = input.psi_value / 14.5038; results["bar_copy"] = Number.isFinite(v) ? v : 0; } catch { results["bar_copy"] = 0; }
  return results;
}


export function calculatePsi_to_bar(input: Psi_to_barInput): Psi_to_barOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bar"] ?? 0;
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


export interface Psi_to_barOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

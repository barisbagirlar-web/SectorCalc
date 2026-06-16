// Auto-generated from ponderal-index-schema.json
import * as z from 'zod';

export interface Ponderal_indexInput {
  massKg: number;
  heightCm: number;
  refMassKg: number;
  refHeightCm: number;
}

export const Ponderal_indexInputSchema = z.object({
  massKg: z.number().default(70),
  heightCm: z.number().default(170),
  refMassKg: z.number().default(70),
  refHeightCm: z.number().default(170),
});

function evaluateAllFormulas(input: Ponderal_indexInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massKg / ((input.heightCm / 100) ** 3); results["piPatient"] = Number.isFinite(v) ? v : 0; } catch { results["piPatient"] = 0; }
  try { const v = input.refMassKg / ((input.refHeightCm / 100) ** 3); results["piReference"] = Number.isFinite(v) ? v : 0; } catch { results["piReference"] = 0; }
  try { const v = (results["piPatient"] ?? 0) - (results["piReference"] ?? 0); results["piDifference"] = Number.isFinite(v) ? v : 0; } catch { results["piDifference"] = 0; }
  return results;
}


export function calculatePonderal_index(input: Ponderal_indexInput): Ponderal_indexOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["piPatient"] ?? 0;
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


export interface Ponderal_indexOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

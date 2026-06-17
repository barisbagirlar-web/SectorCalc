// Auto-generated from kgf-per-cm2-to-psi-schema.json
import * as z from 'zod';

export interface Kgf_per_cm2_to_psiInput {
  pressure_kgfcm2: number;
  auto_input_2: number;
  auto_input_3: number;
}

export const Kgf_per_cm2_to_psiInputSchema = z.object({
  pressure_kgfcm2: z.number().default(1),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Kgf_per_cm2_to_psiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressure_kgfcm2 * 14.2233433071; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.pressure_kgfcm2; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  results["1_kgf_cm____14_2233433071_psi"] = 0;
  try { const v = Basınç (psi); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateKgf_per_cm2_to_psi(input: Kgf_per_cm2_to_psiInput): Kgf_per_cm2_to_psiOutput {
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


export interface Kgf_per_cm2_to_psiOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

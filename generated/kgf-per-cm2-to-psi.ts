// Auto-generated from kgf-per-cm2-to-psi-schema.json
import * as z from 'zod';

export interface Kgf_per_cm2_to_psiInput {
  pressure_kgfcm2: number;
  auto_input_2: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Kgf_per_cm2_to_psiInputSchema = z.object({
  pressure_kgfcm2: z.number().default(1),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kgf_per_cm2_to_psiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressure_kgfcm2 * 14.2233433071; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.pressure_kgfcm2; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKgf_per_cm2_to_psi(input: Kgf_per_cm2_to_psiInput): Kgf_per_cm2_to_psiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["breakdown"]));
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


export interface Kgf_per_cm2_to_psiOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

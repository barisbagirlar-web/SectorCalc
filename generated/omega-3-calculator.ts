// Auto-generated from omega-3-calculator-schema.json
import * as z from 'zod';

export interface Omega_3_calculatorInput {
  capsule_size: number;
  capsules_per_day: number;
  epa_percent: number;
  dha_percent: number;
  body_weight_kg: number;
  dataConfidence?: number;
}

export const Omega_3_calculatorInputSchema = z.object({
  capsule_size: z.number().default(1000),
  capsules_per_day: z.number().default(1),
  epa_percent: z.number().default(18),
  dha_percent: z.number().default(12),
  body_weight_kg: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Omega_3_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capsule_size * input.capsules_per_day * (input.epa_percent / 100); results["total_epa_mg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_epa_mg"] = 0; }
  try { const v = input.capsule_size * input.capsules_per_day * (input.dha_percent / 100); results["total_dha_mg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_dha_mg"] = 0; }
  try { const v = input.capsule_size * input.capsules_per_day * ((input.epa_percent + input.dha_percent) / 100); results["combined_epa_dha_mg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["combined_epa_dha_mg"] = 0; }
  try { const v = (input.capsule_size * input.capsules_per_day * (input.epa_percent / 100)) / input.body_weight_kg; results["epa_per_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["epa_per_kg"] = 0; }
  try { const v = (input.capsule_size * input.capsules_per_day * (input.dha_percent / 100)) / input.body_weight_kg; results["dha_per_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dha_per_kg"] = 0; }
  try { const v = (input.capsule_size * input.capsules_per_day * ((input.epa_percent + input.dha_percent) / 100)) / input.body_weight_kg; results["combined_per_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["combined_per_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOmega_3_calculator(input: Omega_3_calculatorInput): Omega_3_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["combined_epa_dha_mg"]);
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


export interface Omega_3_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

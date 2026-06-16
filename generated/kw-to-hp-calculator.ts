// Auto-generated from kw-to-hp-calculator-schema.json
import * as z from 'zod';

export interface Kw_to_hp_calculatorInput {
  kW: number;
  efficiency: number;
  loadFactor: number;
  customFactor: number;
}

export const Kw_to_hp_calculatorInputSchema = z.object({
  kW: z.number().default(1),
  efficiency: z.number().default(90),
  loadFactor: z.number().default(100),
  customFactor: z.number().default(1.34102),
});

function evaluateAllFormulas(input: Kw_to_hp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kW * (input.efficiency / 100) * (input.loadFactor / 100); results["effectiveKW"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveKW"] = 0; }
  try { const v = (results["effectiveKW"] ?? 0) * 1.34102; results["hp_mechanical"] = Number.isFinite(v) ? v : 0; } catch { results["hp_mechanical"] = 0; }
  try { const v = (results["effectiveKW"] ?? 0) * 1.35962; results["hp_metric"] = Number.isFinite(v) ? v : 0; } catch { results["hp_metric"] = 0; }
  try { const v = (results["effectiveKW"] ?? 0) * 1.34048; results["hp_electrical"] = Number.isFinite(v) ? v : 0; } catch { results["hp_electrical"] = 0; }
  try { const v = (results["effectiveKW"] ?? 0) * input.customFactor; results["hp_custom"] = Number.isFinite(v) ? v : 0; } catch { results["hp_custom"] = 0; }
  return results;
}


export function calculateKw_to_hp_calculator(input: Kw_to_hp_calculatorInput): Kw_to_hp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hp_custom"] ?? 0;
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


export interface Kw_to_hp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

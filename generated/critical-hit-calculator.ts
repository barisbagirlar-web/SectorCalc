// Auto-generated from critical-hit-calculator-schema.json
import * as z from 'zod';

export interface Critical_hit_calculatorInput {
  base_critical_rate: number;
  critical_modifier: number;
  crit_damage_multiplier: number;
  number_of_attacks: number;
}

export const Critical_hit_calculatorInputSchema = z.object({
  base_critical_rate: z.number().default(5),
  critical_modifier: z.number().default(0),
  crit_damage_multiplier: z.number().default(1.5),
  number_of_attacks: z.number().default(10),
});

function evaluateAllFormulas(input: Critical_hit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (baseCriticalRate + criticalModifier) / 100; results["effectiveCritRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveCritRate"] = 0; }
  try { const v = (results["effectiveCritRate"] ?? 0) * numberOfAttacks; results["expectedCritHits"] = Number.isFinite(v) ? v : 0; } catch { results["expectedCritHits"] = 0; }
  try { const v = 1 - Math.pow(1 - (results["effectiveCritRate"] ?? 0), numberOfAttacks); results["probabilityAtLeastOne"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityAtLeastOne"] = 0; }
  try { const v = (results["probabilityAtLeastOne"] ?? 0) * 100; results["probabilityAtLeastOnePercent"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityAtLeastOnePercent"] = 0; }
  try { const v = 1 + (results["effectiveCritRate"] ?? 0) * (critDamageMultiplier - 1); results["expectedDamageMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["expectedDamageMultiplier"] = 0; }
  return results;
}


export function calculateCritical_hit_calculator(input: Critical_hit_calculatorInput): Critical_hit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probabilityAtLeastOnePercent"] ?? 0;
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


export interface Critical_hit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

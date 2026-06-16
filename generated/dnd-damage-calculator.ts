// Auto-generated from dnd-damage-calculator-schema.json
import * as z from 'zod';

export interface Dnd_damage_calculatorInput {
  weaponDamage: number;
  abilityModifier: number;
  proficiencyBonus: number;
  magicBonus: number;
  criticalHitChance: number;
  extraDamageDice: number;
  damageMultiplier: number;
}

export const Dnd_damage_calculatorInputSchema = z.object({
  weaponDamage: z.number().default(4.5),
  abilityModifier: z.number().default(3),
  proficiencyBonus: z.number().default(2),
  magicBonus: z.number().default(0),
  criticalHitChance: z.number().default(5),
  extraDamageDice: z.number().default(0),
  damageMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Dnd_damage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weaponDamage + input.abilityModifier + input.magicBonus + input.extraDamageDice; results["baseDamage"] = Number.isFinite(v) ? v : 0; } catch { results["baseDamage"] = 0; }
  try { const v = (results["baseDamage"] ?? 0) * 2; results["criticalDamage"] = Number.isFinite(v) ? v : 0; } catch { results["criticalDamage"] = 0; }
  try { const v = (results["baseDamage"] ?? 0) * (1 - input.criticalHitChance / 100) + (results["criticalDamage"] ?? 0) * (input.criticalHitChance / 100); results["averageDamagePerHit"] = Number.isFinite(v) ? v : 0; } catch { results["averageDamagePerHit"] = 0; }
  try { const v = (results["averageDamagePerHit"] ?? 0) * input.damageMultiplier; results["finalDamage"] = Number.isFinite(v) ? v : 0; } catch { results["finalDamage"] = 0; }
  return results;
}


export function calculateDnd_damage_calculator(input: Dnd_damage_calculatorInput): Dnd_damage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalDamage"] ?? 0;
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


export interface Dnd_damage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

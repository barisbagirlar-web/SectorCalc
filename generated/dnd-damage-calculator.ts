// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dnd_damage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weaponDamage + input.abilityModifier + input.magicBonus + input.extraDamageDice; results["baseDamage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseDamage"] = 0; }
  try { const v = (asFormulaNumber(results["baseDamage"])) * 2; results["criticalDamage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["criticalDamage"] = 0; }
  try { const v = (asFormulaNumber(results["baseDamage"])) * (1 - input.criticalHitChance / 100) + (asFormulaNumber(results["criticalDamage"])) * (input.criticalHitChance / 100); results["averageDamagePerHit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averageDamagePerHit"] = 0; }
  try { const v = (asFormulaNumber(results["averageDamagePerHit"])) * input.damageMultiplier; results["finalDamage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalDamage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDnd_damage_calculator(input: Dnd_damage_calculatorInput): Dnd_damage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalDamage"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

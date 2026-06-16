// Auto-generated from apache-ii-calculator-schema.json
import * as z from 'zod';

export interface Apache_ii_calculatorInput {
  operatorSkill: number;
  machineAge: number;
  maintenanceFrequency: number;
  ambientTemp: number;
  vibrationLevel: number;
  energyConsumption: number;
}

export const Apache_ii_calculatorInputSchema = z.object({
  operatorSkill: z.number().default(5),
  machineAge: z.number().default(5),
  maintenanceFrequency: z.number().default(2),
  ambientTemp: z.number().default(25),
  vibrationLevel: z.number().default(2),
  energyConsumption: z.number().default(50),
});

function evaluateAllFormulas(input: Apache_ii_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operatorSkill * 5; results["operatorSkillComponent"] = Number.isFinite(v) ? v : 0; } catch { results["operatorSkillComponent"] = 0; }
  try { const v = Math.max(0, 100 - input.machineAge * 5); results["machineAgeComponent"] = Number.isFinite(v) ? v : 0; } catch { results["machineAgeComponent"] = 0; }
  try { const v = input.maintenanceFrequency * 10; results["maintenanceComponent"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceComponent"] = 0; }
  try { const v = Math.abs(input.ambientTemp - 25) * 2 + input.vibrationLevel * 3 + input.energyConsumption * 0.5; results["environmentalPenalty"] = Number.isFinite(v) ? v : 0; } catch { results["environmentalPenalty"] = 0; }
  try { const v = Math.max(0, Math.min(100, (results["operatorSkillComponent"] ?? 0) + (results["machineAgeComponent"] ?? 0) + (results["maintenanceComponent"] ?? 0) - (results["environmentalPenalty"] ?? 0))); results["equipmentEffectivenessScore"] = Number.isFinite(v) ? v : 0; } catch { results["equipmentEffectivenessScore"] = 0; }
  return results;
}


export function calculateApache_ii_calculator(input: Apache_ii_calculatorInput): Apache_ii_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["equipmentEffectivenessScore"] ?? 0;
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


export interface Apache_ii_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

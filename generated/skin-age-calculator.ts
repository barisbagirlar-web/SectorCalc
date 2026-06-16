// Auto-generated from skin-age-calculator-schema.json
import * as z from 'zod';

export interface Skin_age_calculatorInput {
  chronologicalAge: number;
  sunExposure: number;
  smokingYears: number;
  skincareScore: number;
  sleepHours: number;
  stressLevel: number;
}

export const Skin_age_calculatorInputSchema = z.object({
  chronologicalAge: z.number().default(30),
  sunExposure: z.number().default(2),
  smokingYears: z.number().default(0),
  skincareScore: z.number().default(5),
  sleepHours: z.number().default(7),
  stressLevel: z.number().default(3),
});

function evaluateAllFormulas(input: Skin_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chronologicalAge + Math.max(0, (input.sunExposure - 1) * 0.5) + input.smokingYears * 0.3 - Math.max(0, (input.skincareScore - 5) * 0.2) + (input.sleepHours < 7 ? (7 - input.sleepHours) * 0.5 : input.sleepHours > 9 ? (input.sleepHours - 9) * 0.2 : 0) + (input.stressLevel > 5 ? (input.stressLevel - 5) * 0.3 : 0); results["estimatedSkinAge"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedSkinAge"] = 0; }
  try { const v = Math.max(0, (input.sunExposure - 1) * 0.5); results["sunDamage"] = Number.isFinite(v) ? v : 0; } catch { results["sunDamage"] = 0; }
  try { const v = input.smokingYears * 0.3; results["smokingImpact"] = Number.isFinite(v) ? v : 0; } catch { results["smokingImpact"] = 0; }
  try { const v = Math.max(0, (input.skincareScore - 5) * 0.2); results["skincareBenefit"] = Number.isFinite(v) ? v : 0; } catch { results["skincareBenefit"] = 0; }
  try { const v = (input.sleepHours < 7 ? (7 - input.sleepHours) * 0.5 : input.sleepHours > 9 ? (input.sleepHours - 9) * 0.2 : 0); results["sleepImpact"] = Number.isFinite(v) ? v : 0; } catch { results["sleepImpact"] = 0; }
  try { const v = input.stressLevel > 5 ? (input.stressLevel - 5) * 0.3 : 0; results["stressImpact"] = Number.isFinite(v) ? v : 0; } catch { results["stressImpact"] = 0; }
  return results;
}


export function calculateSkin_age_calculator(input: Skin_age_calculatorInput): Skin_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedSkinAge"] ?? 0;
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


export interface Skin_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

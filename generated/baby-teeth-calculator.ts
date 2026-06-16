// Auto-generated from baby-teeth-calculator-schema.json
import * as z from 'zod';

export interface Baby_teeth_calculatorInput {
  ageMonths: number;
  geneticFactor: number;
  calciumIntake: number;
  breastfeedingDuration: number;
}

export const Baby_teeth_calculatorInputSchema = z.object({
  ageMonths: z.number().default(12),
  geneticFactor: z.number().default(1),
  calciumIntake: z.number().default(500),
  breastfeedingDuration: z.number().default(6),
});

function evaluateAllFormulas(input: Baby_teeth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.ageMonths - 6); results["baseTeeth"] = Number.isFinite(v) ? v : 0; } catch { results["baseTeeth"] = 0; }
  try { const v = input.geneticFactor - 1; results["geneticModifier"] = Number.isFinite(v) ? v : 0; } catch { results["geneticModifier"] = 0; }
  try { const v = (input.calciumIntake - 500) / 500; results["calciumModifier"] = Number.isFinite(v) ? v : 0; } catch { results["calciumModifier"] = 0; }
  try { const v = Math.max(0, (input.breastfeedingDuration - 6) * -0.2); results["breastfeedingModifier"] = Number.isFinite(v) ? v : 0; } catch { results["breastfeedingModifier"] = 0; }
  try { const v = (results["geneticModifier"] ?? 0) + (results["calciumModifier"] ?? 0) + (results["breastfeedingModifier"] ?? 0); results["totalModifier"] = Number.isFinite(v) ? v : 0; } catch { results["totalModifier"] = 0; }
  try { const v = (results["baseTeeth"] ?? 0) * (1 + (results["totalModifier"] ?? 0)); results["expectedTeethRaw"] = Number.isFinite(v) ? v : 0; } catch { results["expectedTeethRaw"] = 0; }
  try { const v = Math.max(0, Math.round((results["expectedTeethRaw"] ?? 0))); results["expectedTeeth"] = Number.isFinite(v) ? v : 0; } catch { results["expectedTeeth"] = 0; }
  try { const v = 'Temel: ' + (results["baseTeeth"] ?? 0).toFixed(0) + ' diş'; results["breakdownBase"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownBase"] = 0; }
  try { const v = ((results["geneticModifier"] ?? 0) >= 0 ? 'Genetik: +' : 'Genetik: ') + ((results["geneticModifier"] ?? 0) * (results["baseTeeth"] ?? 0)).toFixed(1) + ' diş'; results["breakdownGenetic"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownGenetic"] = 0; }
  try { const v = ((results["calciumModifier"] ?? 0) >= 0 ? 'Kalsiyum: +' : 'Kalsiyum: ') + ((results["calciumModifier"] ?? 0) * (results["baseTeeth"] ?? 0)).toFixed(1) + ' diş'; results["breakdownCalcium"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownCalcium"] = 0; }
  try { const v = ((results["breastfeedingModifier"] ?? 0) >= 0 ? 'Emzirme: +' : 'Emzirme: ') + ((results["breastfeedingModifier"] ?? 0) * (results["baseTeeth"] ?? 0)).toFixed(1) + ' diş'; results["breakdownBreastfeeding"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownBreastfeeding"] = 0; }
  try { const v = 'Toplam: ' + (results["expectedTeeth"] ?? 0) + ' diş'; results["breakdownTotal"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownTotal"] = 0; }
  return results;
}


export function calculateBaby_teeth_calculator(input: Baby_teeth_calculatorInput): Baby_teeth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["expectedTeeth"] ?? 0;
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


export interface Baby_teeth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from ampacity-calculator-schema.json
import * as z from 'zod';

export interface Ampacity_calculatorInput {
  materialFactor: number;
  area: number;
  insulationTemp: number;
  ambientTemp: number;
  bundlingFactor: number;
}

export const Ampacity_calculatorInputSchema = z.object({
  materialFactor: z.number().default(1),
  area: z.number().default(2.5),
  insulationTemp: z.number().default(60),
  ambientTemp: z.number().default(30),
  bundlingFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Ampacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(materialFactor, area, insulationTemp, ambientTemp, bundlingFactor) { const baseAmpacity = 15 * Math.pow(area, 0.6); const tempFactor = Math.sqrt((insulationTemp - ambientTemp) / (insulationTemp - 30)); const finalAmpacity = materialFactor * baseAmpacity * tempFactor * bundlingFactor; return { primary: finalAmpacity.toFixed(2) + ' A', breakdown: ['Base Ampacity: ' + baseAmpacity.toFixed(2) + ' A', 'Temperature Derating Factor: ' + tempFactor.toFixed(4), 'Bundling Factor: ' + bundlingFactor.toFixed(4), 'Material Factor: ' + materialFactor.toFixed(4), 'Final Ampacity: ' + finalAmpacity.toFixed(2) + ' A'] }; })(input.materialFactor, input.area, input.insulationTemp, input.ambientTemp, input.bundlingFactor); results["calculate"] = Number.isFinite(v) ? v : 0; } catch { results["calculate"] = 0; }
  return results;
}


export function calculateAmpacity_calculator(input: Ampacity_calculatorInput): Ampacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalAmpacity"] ?? 0;
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


export interface Ampacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

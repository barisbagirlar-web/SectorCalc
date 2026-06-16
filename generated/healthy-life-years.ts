// Auto-generated from healthy-life-years-schema.json
import * as z from 'zod';

export interface Healthy_life_yearsInput {
  currentAge: number;
  expectedLifespan: number;
  maintenanceFactor: number;
  usageIntensity: number;
  loadFactor: number;
  environmentSeverity: number;
  downtimeFrequency: number;
}

export const Healthy_life_yearsInputSchema = z.object({
  currentAge: z.number().default(5),
  expectedLifespan: z.number().default(15),
  maintenanceFactor: z.number().default(1),
  usageIntensity: z.number().default(100),
  loadFactor: z.number().default(100),
  environmentSeverity: z.number().default(0),
  downtimeFrequency: z.number().default(2),
});

function evaluateAllFormulas(input: Healthy_life_yearsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.expectedLifespan - input.currentAge) * input.maintenanceFactor; results["adjustedLifespan"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedLifespan"] = 0; }
  try { const v = (input.usageIntensity/100) * (input.loadFactor/100) * (1 + input.environmentSeverity) * (1 + input.downtimeFrequency/50); results["stressFactor"] = Number.isFinite(v) ? v : 0; } catch { results["stressFactor"] = 0; }
  try { const v = (results["adjustedLifespan"] ?? 0) / (results["stressFactor"] ?? 0); results["healthyLifeRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["healthyLifeRemaining"] = 0; }
  return results;
}


export function calculateHealthy_life_years(input: Healthy_life_yearsInput): Healthy_life_yearsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["healthyLifeRemaining"] ?? 0;
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


export interface Healthy_life_yearsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

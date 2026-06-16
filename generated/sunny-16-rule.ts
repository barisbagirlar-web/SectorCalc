// Auto-generated from sunny-16-rule-schema.json
import * as z from 'zod';

export interface Sunny_16_ruleInput {
  aperture: number;
  iso: number;
  lightCondition: number;
  ndFilter: number;
}

export const Sunny_16_ruleInputSchema = z.object({
  aperture: z.number().default(16),
  iso: z.number().default(100),
  lightCondition: z.number().default(0),
  ndFilter: z.number().default(0),
});

function evaluateAllFormulas(input: Sunny_16_ruleInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (input.iso / 100); results["baseShutterSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["baseShutterSpeed"] = 0; }
  try { const v = Math.pow(2, input.lightCondition); results["evAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["evAdjustment"] = 0; }
  try { const v = Math.pow(2, input.ndFilter); results["ndAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["ndAdjustment"] = 0; }
  try { const v = (results["baseShutterSpeed"] ?? 0) * (results["evAdjustment"] ?? 0) / (results["ndAdjustment"] ?? 0); results["shutterSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed"] = 0; }
  try { const v = Math.pow(input.aperture / 16, 2); results["apertureAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["apertureAdjustment"] = 0; }
  try { const v = (results["shutterSpeed"] ?? 0) * (results["apertureAdjustment"] ?? 0); results["finalShutterSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["finalShutterSpeed"] = 0; }
  return results;
}


export function calculateSunny_16_rule(input: Sunny_16_ruleInput): Sunny_16_ruleOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalShutterSpeed"] ?? 0;
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


export interface Sunny_16_ruleOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

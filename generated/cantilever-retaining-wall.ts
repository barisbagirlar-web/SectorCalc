// Auto-generated from cantilever-retaining-wall-schema.json
import * as z from 'zod';

export interface Cantilever_retaining_wallInput {
  height: number;
  stemThickness: number;
  baseWidth: number;
  baseThickness: number;
  heelLength: number;
  toeLength: number;
  soilDensity: number;
  frictionAngle: number;
}

export const Cantilever_retaining_wallInputSchema = z.object({
  height: z.number().default(3),
  stemThickness: z.number().default(0.3),
  baseWidth: z.number().default(2),
  baseThickness: z.number().default(0.4),
  heelLength: z.number().default(1.2),
  toeLength: z.number().default(0.8),
  soilDensity: z.number().default(18),
  frictionAngle: z.number().default(30),
});

function evaluateAllFormulas(input: Cantilever_retaining_wallInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.tan((45 - input.frictionAngle / 2) * Math.PI / 180) ** 2; results["activePressureCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["activePressureCoefficient"] = 0; }
  try { const v = 0.5 * input.soilDensity * input.height ** 2 * (results["activePressureCoefficient"] ?? 0); results["totalActiveForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalActiveForce"] = 0; }
  try { const v = (results["totalActiveForce"] ?? 0) * input.height / 3; results["overturningMoment"] = Number.isFinite(v) ? v : 0; } catch { results["overturningMoment"] = 0; }
  try { const v = input.stemThickness * input.height * 25; results["wallWeight"] = Number.isFinite(v) ? v : 0; } catch { results["wallWeight"] = 0; }
  try { const v = input.baseWidth * input.baseThickness * 25; results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = input.heelLength * input.baseThickness * 25; results["heelWeight"] = Number.isFinite(v) ? v : 0; } catch { results["heelWeight"] = 0; }
  try { const v = input.toeLength * input.baseThickness * 25; results["toeWeight"] = Number.isFinite(v) ? v : 0; } catch { results["toeWeight"] = 0; }
  try { const v = (results["wallWeight"] ?? 0) + (results["baseWeight"] ?? 0) + (results["heelWeight"] ?? 0) + (results["toeWeight"] ?? 0); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * input.baseWidth / 2; results["resistingMoment"] = Number.isFinite(v) ? v : 0; } catch { results["resistingMoment"] = 0; }
  try { const v = (results["resistingMoment"] ?? 0) / (results["overturningMoment"] ?? 0); results["factorOfSafetyOverturning"] = Number.isFinite(v) ? v : 0; } catch { results["factorOfSafetyOverturning"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * Math.tan(input.frictionAngle * Math.PI / 180); results["slidingResistance"] = Number.isFinite(v) ? v : 0; } catch { results["slidingResistance"] = 0; }
  try { const v = (results["slidingResistance"] ?? 0) / (results["totalActiveForce"] ?? 0); results["factorOfSafetySliding"] = Number.isFinite(v) ? v : 0; } catch { results["factorOfSafetySliding"] = 0; }
  return results;
}


export function calculateCantilever_retaining_wall(input: Cantilever_retaining_wallInput): Cantilever_retaining_wallOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Factor"] ?? 0;
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


export interface Cantilever_retaining_wallOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

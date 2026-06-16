// Auto-generated from rendering-time-calculator-schema.json
import * as z from 'zod';

export interface Rendering_time_calculatorInput {
  resolutionWidth: number;
  resolutionHeight: number;
  samplesPerPixel: number;
  frameCount: number;
  renderEngineSpeed: number;
  complexityFactor: number;
  maxBounces: number;
}

export const Rendering_time_calculatorInputSchema = z.object({
  resolutionWidth: z.number().default(1920),
  resolutionHeight: z.number().default(1080),
  samplesPerPixel: z.number().default(128),
  frameCount: z.number().default(1),
  renderEngineSpeed: z.number().default(1000000),
  complexityFactor: z.number().default(1),
  maxBounces: z.number().default(4),
});

function evaluateAllFormulas(input: Rendering_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resolutionWidth * input.resolutionHeight; results["totalPixels"] = Number.isFinite(v) ? v : 0; } catch { results["totalPixels"] = 0; }
  try { const v = (results["totalPixels"] ?? 0) * input.samplesPerPixel * input.maxBounces * input.complexityFactor; results["totalRaysPerFrame"] = Number.isFinite(v) ? v : 0; } catch { results["totalRaysPerFrame"] = 0; }
  try { const v = (results["totalRaysPerFrame"] ?? 0) * input.frameCount; results["totalRays"] = Number.isFinite(v) ? v : 0; } catch { results["totalRays"] = 0; }
  try { const v = (results["totalRays"] ?? 0) / input.renderEngineSpeed; results["renderTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["renderTimeSeconds"] = 0; }
  try { const v = (results["renderTimeSeconds"] ?? 0) / 60; results["renderTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["renderTimeMinutes"] = 0; }
  try { const v = (results["renderTimeMinutes"] ?? 0) / 60; results["renderTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["renderTimeHours"] = 0; }
  return results;
}


export function calculateRendering_time_calculator(input: Rendering_time_calculatorInput): Rendering_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["renderTimeHours"] ?? 0;
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


export interface Rendering_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

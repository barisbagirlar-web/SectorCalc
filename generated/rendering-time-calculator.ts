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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rendering_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resolutionWidth * input.resolutionHeight; results["totalPixels"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPixels"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPixels"])) * input.samplesPerPixel * input.maxBounces * input.complexityFactor; results["totalRaysPerFrame"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRaysPerFrame"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRaysPerFrame"])) * input.frameCount; results["totalRays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRays"])) / input.renderEngineSpeed; results["renderTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["renderTimeSeconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["renderTimeSeconds"])) / 60; results["renderTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["renderTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["renderTimeMinutes"])) / 60; results["renderTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["renderTimeHours"] = Number.NaN; }
  return results;
}


export function calculateRendering_time_calculator(input: Rendering_time_calculatorInput): Rendering_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["renderTimeHours"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

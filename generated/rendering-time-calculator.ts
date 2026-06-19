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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rendering_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resolutionWidth * input.resolutionHeight; results["totalPixels"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPixels"] = 0; }
  try { const v = (asFormulaNumber(results["totalPixels"])) * input.samplesPerPixel * input.maxBounces * input.complexityFactor; results["totalRaysPerFrame"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRaysPerFrame"] = 0; }
  try { const v = (asFormulaNumber(results["totalRaysPerFrame"])) * input.frameCount; results["totalRays"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRays"] = 0; }
  try { const v = (asFormulaNumber(results["totalRays"])) / input.renderEngineSpeed; results["renderTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["renderTimeSeconds"] = 0; }
  try { const v = (asFormulaNumber(results["renderTimeSeconds"])) / 60; results["renderTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["renderTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["renderTimeMinutes"])) / 60; results["renderTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["renderTimeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRendering_time_calculator(input: Rendering_time_calculatorInput): Rendering_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["renderTimeHours"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

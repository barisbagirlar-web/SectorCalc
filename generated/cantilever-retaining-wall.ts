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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cantilever_retaining_wallInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stemThickness * input.height * 25; results["wallWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallWeight"] = Number.NaN; }
  try { const v = input.baseWidth * input.baseThickness * 25; results["baseWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseWeight"] = Number.NaN; }
  try { const v = input.heelLength * input.baseThickness * 25; results["heelWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heelWeight"] = Number.NaN; }
  try { const v = input.toeLength * input.baseThickness * 25; results["toeWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toeWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallWeight"])) + (toNumericFormulaValue(results["baseWeight"])) + (toNumericFormulaValue(results["heelWeight"])) + (toNumericFormulaValue(results["toeWeight"])); results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeight"])) * input.baseWidth / 2; results["resistingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resistingMoment"] = Number.NaN; }
  return results;
}


export function calculateCantilever_retaining_wall(input: Cantilever_retaining_wallInput): Cantilever_retaining_wallOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["resistingMoment"]);
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


export interface Cantilever_retaining_wallOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

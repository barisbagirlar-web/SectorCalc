// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cantilever_retaining_wallInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stemThickness * input.height * 25; results["wallWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wallWeight"] = 0; }
  try { const v = input.baseWidth * input.baseThickness * 25; results["baseWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = input.heelLength * input.baseThickness * 25; results["heelWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heelWeight"] = 0; }
  try { const v = input.toeLength * input.baseThickness * 25; results["toeWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["toeWeight"] = 0; }
  try { const v = (asFormulaNumber(results["wallWeight"])) + (asFormulaNumber(results["baseWeight"])) + (asFormulaNumber(results["heelWeight"])) + (asFormulaNumber(results["toeWeight"])); results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) * input.baseWidth / 2; results["resistingMoment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["resistingMoment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCantilever_retaining_wall(input: Cantilever_retaining_wallInput): Cantilever_retaining_wallOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["resistingMoment"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

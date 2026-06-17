// @ts-nocheck
// Auto-generated from thin-wall-vessel-schema.json
import * as z from 'zod';

export interface Thin_wall_vesselInput {
  internalPressure: number;
  innerRadius: number;
  wallThickness: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
}

export const Thin_wall_vesselInputSchema = z.object({
  internalPressure: z.number().default(1),
  innerRadius: z.number().default(500),
  wallThickness: z.number().default(5),
  allowableStress: z.number().default(200),
  jointEfficiency: z.number().default(0.85),
  corrosionAllowance: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thin_wall_vesselInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.internalPressure * (input.innerRadius + input.wallThickness/2) / input.wallThickness; results["hoopStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hoopStress"] = 0; }
  try { const v = input.internalPressure * (input.innerRadius + input.wallThickness/2) / (2 * input.wallThickness); results["longitudinalStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["longitudinalStress"] = 0; }
  try { const v = (input.internalPressure * input.innerRadius) / (input.allowableStress * input.jointEfficiency - 0.6 * input.internalPressure) + input.corrosionAllowance; results["requiredThickness"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredThickness"] = 0; }
  try { const v = input.allowableStress / (asFormulaNumber(results["hoopStress"])); results["safetyFactorHoop"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyFactorHoop"] = 0; }
  try { const v = input.allowableStress / (asFormulaNumber(results["longitudinalStress"])); results["safetyFactorLong"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyFactorLong"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThin_wall_vessel(input: Thin_wall_vesselInput): Thin_wall_vesselOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hoopStress"]);
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


export interface Thin_wall_vesselOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from aquarium-volume-calculator-schema.json
import * as z from 'zod';

export interface Aquarium_volume_calculatorInput {
  length: number;
  width: number;
  height: number;
  waterFillDepth: number;
  substrateDepth: number;
  glassThickness: number;
}

export const Aquarium_volume_calculatorInputSchema = z.object({
  length: z.number().default(60),
  width: z.number().default(30),
  height: z.number().default(36),
  waterFillDepth: z.number().default(30),
  substrateDepth: z.number().default(5),
  glassThickness: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Aquarium_volume_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.length - 2 * (input.glassThickness / 10); results["interiorLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interiorLength"] = 0; }
  try { const v = input.width - 2 * (input.glassThickness / 10); results["interiorWidth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interiorWidth"] = 0; }
  try { const v = input.waterFillDepth - input.substrateDepth; results["effectiveWaterDepth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveWaterDepth"] = 0; }
  try { const v = (asFormulaNumber(results["interiorLength"])) * (asFormulaNumber(results["interiorWidth"])) * (asFormulaNumber(results["effectiveWaterDepth"])); results["volume_cm3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volume_cm3"] = 0; }
  try { const v = (asFormulaNumber(results["volume_cm3"])) / 1000; results["waterVolume_L"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterVolume_L"] = 0; }
  try { const v = (asFormulaNumber(results["waterVolume_L"])) * 0.264172; results["waterVolume_gal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterVolume_gal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAquarium_volume_calculator(input: Aquarium_volume_calculatorInput): Aquarium_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["waterVolume_gal"]);
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


export interface Aquarium_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from shutter-speed-calculator-schema.json
import * as z from 'zod';

export interface Shutter_speed_calculatorInput {
  objectSpeed: number;
  distance: number;
  focalLength: number;
  pixelSize: number;
  allowableBlur: number;
  dataConfidence?: number;
}

export const Shutter_speed_calculatorInputSchema = z.object({
  objectSpeed: z.number().default(1),
  distance: z.number().default(5),
  focalLength: z.number().default(50),
  pixelSize: z.number().default(5),
  allowableBlur: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shutter_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.pixelSize * input.allowableBlur / (input.objectSpeed * input.focalLength * 1000); results["shutterSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed"] = 0; }
  try { const v = (asFormulaNumber(results["shutterSpeed"])) * 1000; results["shutterSpeed_ms"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed_ms"] = 0; }
  try { const v = (asFormulaNumber(results["shutterSpeed"])) * 1000000; results["shutterSpeed_us"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed_us"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShutter_speed_calculator(input: Shutter_speed_calculatorInput): Shutter_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["shutterSpeed"]));
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


export interface Shutter_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

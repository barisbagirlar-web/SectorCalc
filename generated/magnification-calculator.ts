// Auto-generated from magnification-calculator-schema.json
import * as z from 'zod';

export interface Magnification_calculatorInput {
  objectDistance: number;
  imageDistance: number;
  focalLength: number;
  objectHeight: number;
  imageHeight: number;
  dataConfidence?: number;
}

export const Magnification_calculatorInputSchema = z.object({
  objectDistance: z.number().default(100),
  imageDistance: z.number().default(200),
  focalLength: z.number().default(0),
  objectHeight: z.number().default(10),
  imageHeight: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Magnification_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.imageDistance / input.objectDistance; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.objectDistance; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = input.imageHeight / input.objectHeight; results["imageHeight___objectHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["imageHeight___objectHeight"] = 0; }
  try { const v = input.focalLength / (input.objectDistance - input.focalLength); results["focalLength____objectDistance___focalLen"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["focalLength____objectDistance___focalLen"] = 0; }
  try { const v = (input.imageDistance - input.focalLength) / input.focalLength; results["_imageDistance___focalLength____focalLen"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["_imageDistance___focalLength____focalLen"] = 0; }
  try { const v = input.imageDistance / input.objectDistance; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMagnification_calculator(input: Magnification_calculatorInput): Magnification_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Magnification_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

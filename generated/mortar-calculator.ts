// Auto-generated from mortar-calculator-schema.json
import * as z from 'zod';

export interface Mortar_calculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickWidth: number;
  brickHeight: number;
  jointThickness: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Mortar_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(190),
  brickWidth: z.number().default(90),
  brickHeight: z.number().default(90),
  jointThickness: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight * (input.brickWidth / 1000); results["wallVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallVolume"] = Number.NaN; }
  try { const v = (input.brickLength / 1000) * (input.brickWidth / 1000) * (input.brickHeight / 1000); results["brickVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brickVolume"] = Number.NaN; }
  try { const v = ((input.brickLength + input.jointThickness) / 1000) * ((input.brickWidth + input.jointThickness) / 1000) * ((input.brickHeight + input.jointThickness) / 1000); results["brickVolumeWithJoint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brickVolumeWithJoint"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallVolume"])) / (toNumericFormulaValue(results["brickVolumeWithJoint"])); results["totalBricks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBricks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBricks"])) * (toNumericFormulaValue(results["brickVolume"])); results["solidVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["solidVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallVolume"])) - (toNumericFormulaValue(results["solidVolume"])); results["mortarVolumeBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mortarVolumeBase"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mortarVolumeBase"])) * (input.wasteFactor / 100); results["waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mortarVolumeBase"])) + (toNumericFormulaValue(results["waste"])); results["totalMortar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMortar"] = Number.NaN; }
  return results;
}


export function calculateMortar_calculator(input: Mortar_calculatorInput): Mortar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMortar"]);
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


export interface Mortar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

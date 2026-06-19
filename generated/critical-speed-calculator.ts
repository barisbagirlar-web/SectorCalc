// Auto-generated from critical-speed-calculator-schema.json
import * as z from 'zod';

export interface Critical_speed_calculatorInput {
  shaftLength: number;
  shaftDiameter: number;
  youngsModulus: number;
  density: number;
  supportFactor: number;
  dataConfidence?: number;
}

export const Critical_speed_calculatorInputSchema = z.object({
  shaftLength: z.number().default(1),
  shaftDiameter: z.number().default(0.05),
  youngsModulus: z.number().default(210000000000),
  density: z.number().default(7850),
  supportFactor: z.number().default(3.141592653589793),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Critical_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shaftLength) * (input.shaftDiameter) * (input.youngsModulus) * (input.density) * (input.supportFactor); results["crossSectionArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["crossSectionArea"] = 0; }
  try { const v = (input.shaftLength) * (input.shaftDiameter) * (input.youngsModulus); results["momentOfInertia"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["momentOfInertia"] = 0; }
  try { const v = (input.shaftLength) * (input.shaftDiameter) * (input.youngsModulus); results["massPerUnitLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["massPerUnitLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCritical_speed_calculator(input: Critical_speed_calculatorInput): Critical_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["massPerUnitLength"]));
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


export interface Critical_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

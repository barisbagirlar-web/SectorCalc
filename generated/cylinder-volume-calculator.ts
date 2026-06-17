// @ts-nocheck
// Auto-generated from cylinder-volume-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_volume_calculatorInput {
  outerRadius: number;
  innerRadius: number;
  height: number;
  quantity: number;
}

export const Cylinder_volume_calculatorInputSchema = z.object({
  outerRadius: z.number().default(1),
  innerRadius: z.number().default(0.5),
  height: z.number().default(2),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cylinder_volume_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * (input.outerRadius ** 2 - input.innerRadius ** 2); results["crossSectionalArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = (asFormulaNumber(results["crossSectionalArea"])) * input.height; results["perCylinderVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["perCylinderVolume"] = 0; }
  try { const v = (asFormulaNumber(results["perCylinderVolume"])) * input.quantity; results["totalVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCylinder_volume_calculator(input: Cylinder_volume_calculatorInput): Cylinder_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Cylinder_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

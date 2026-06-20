// Auto-generated from cylinder-volume-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_volume_calculatorInput {
  outerRadius: number;
  innerRadius: number;
  height: number;
  quantity: number;
  dataConfidence?: number;
}

export const Cylinder_volume_calculatorInputSchema = z.object({
  outerRadius: z.number().default(1),
  innerRadius: z.number().default(0.5),
  height: z.number().default(2),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cylinder_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.outerRadius ** 2 - input.innerRadius ** 2); results["crossSectionalArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crossSectionalArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["crossSectionalArea"])) * input.height; results["perCylinderVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perCylinderVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["perCylinderVolume"])) * input.quantity; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  return results;
}


export function calculateCylinder_volume_calculator(input: Cylinder_volume_calculatorInput): Cylinder_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Cylinder_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

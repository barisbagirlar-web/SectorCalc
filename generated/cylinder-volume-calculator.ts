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

function evaluateAllFormulas(input: Cylinder_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.outerRadius ** 2 - input.innerRadius ** 2); results["crossSectionalArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = (results["crossSectionalArea"] ?? 0) * input.height; results["perCylinderVolume"] = Number.isFinite(v) ? v : 0; } catch { results["perCylinderVolume"] = 0; }
  try { const v = (results["perCylinderVolume"] ?? 0) * input.quantity; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  return results;
}


export function calculateCylinder_volume_calculator(input: Cylinder_volume_calculatorInput): Cylinder_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

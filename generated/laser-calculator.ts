// Auto-generated from laser-calculator-schema.json
import * as z from 'zod';

export interface Laser_calculatorInput {
  laserPower: number;
  cuttingSpeed: number;
  materialThickness: number;
  kerfWidth: number;
  materialAbsorption: number;
  operatingCost: number;
  cutLength: number;
  setupTime: number;
}

export const Laser_calculatorInputSchema = z.object({
  laserPower: z.number().default(100),
  cuttingSpeed: z.number().default(1000),
  materialThickness: z.number().default(5),
  kerfWidth: z.number().default(0.2),
  materialAbsorption: z.number().default(0.8),
  operatingCost: z.number().default(50),
  cutLength: z.number().default(500),
  setupTime: z.number().default(5),
});

function evaluateAllFormulas(input: Laser_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutLength / input.cuttingSpeed + input.setupTime; results["totalCuttingTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalCuttingTime"] = 0; }
  try { const v = input.laserPower * input.materialAbsorption; results["effectivePower"] = Number.isFinite(v) ? v : 0; } catch { results["effectivePower"] = 0; }
  try { const v = (results["effectivePower"] ?? 0) * ((results["totalCuttingTime"] ?? 0) / 60) / 1000; results["energy"] = Number.isFinite(v) ? v : 0; } catch { results["energy"] = 0; }
  try { const v = input.kerfWidth * input.materialThickness * (input.cuttingSpeed / 60); results["materialRemovalRate"] = Number.isFinite(v) ? v : 0; } catch { results["materialRemovalRate"] = 0; }
  try { const v = input.operatingCost * ((results["totalCuttingTime"] ?? 0) / 60); results["cost"] = Number.isFinite(v) ? v : 0; } catch { results["cost"] = 0; }
  return results;
}


export function calculateLaser_calculator(input: Laser_calculatorInput): Laser_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cost"] ?? 0;
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


export interface Laser_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

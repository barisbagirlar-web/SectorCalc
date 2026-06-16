// Auto-generated from surface-area-calculator-schema.json
import * as z from 'zod';

export interface Surface_area_calculatorInput {
  bottomLength: number;
  bottomWidth: number;
  topLength: number;
  topWidth: number;
  height: number;
}

export const Surface_area_calculatorInputSchema = z.object({
  bottomLength: z.number().default(2),
  bottomWidth: z.number().default(1.5),
  topLength: z.number().default(1),
  topWidth: z.number().default(0.8),
  height: z.number().default(3),
});

function evaluateAllFormulas(input: Surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bottomLength * input.bottomWidth; results["bottomArea"] = Number.isFinite(v) ? v : 0; } catch { results["bottomArea"] = 0; }
  try { const v = input.topLength * input.topWidth; results["topArea"] = Number.isFinite(v) ? v : 0; } catch { results["topArea"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.height, 2) + Math.pow((input.bottomWidth - input.topWidth) / 2, 2)); results["slantHeightLength"] = Number.isFinite(v) ? v : 0; } catch { results["slantHeightLength"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.height, 2) + Math.pow((input.bottomLength - input.topLength) / 2, 2)); results["slantHeightWidth"] = Number.isFinite(v) ? v : 0; } catch { results["slantHeightWidth"] = 0; }
  try { const v = (input.bottomLength + input.topLength) * (results["slantHeightLength"] ?? 0); results["lateralAreaLength"] = Number.isFinite(v) ? v : 0; } catch { results["lateralAreaLength"] = 0; }
  try { const v = (input.bottomWidth + input.topWidth) * (results["slantHeightWidth"] ?? 0); results["lateralAreaWidth"] = Number.isFinite(v) ? v : 0; } catch { results["lateralAreaWidth"] = 0; }
  try { const v = (results["bottomArea"] ?? 0) + (results["topArea"] ?? 0) + (results["lateralAreaLength"] ?? 0) + (results["lateralAreaWidth"] ?? 0); results["totalSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


export function calculateSurface_area_calculator(input: Surface_area_calculatorInput): Surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSurfaceArea"] ?? 0;
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


export interface Surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

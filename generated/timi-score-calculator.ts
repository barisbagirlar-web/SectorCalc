// Auto-generated from timi-score-calculator-schema.json
import * as z from 'zod';

export interface Timi_score_calculatorInput {
  inventoryTurnover: number;
  machineUtilization: number;
  orderAccuracy: number;
  defectRate: number;
  maintenanceCompliance: number;
  safetyScore: number;
}

export const Timi_score_calculatorInputSchema = z.object({
  inventoryTurnover: z.number().default(5),
  machineUtilization: z.number().default(85),
  orderAccuracy: z.number().default(98),
  defectRate: z.number().default(2),
  maintenanceCompliance: z.number().default(90),
  safetyScore: z.number().default(95),
});

function evaluateAllFormulas(input: Timi_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inventoryTurnover * 2.5; results["inventoryComponent"] = Number.isFinite(v) ? v : 0; } catch { results["inventoryComponent"] = 0; }
  try { const v = input.machineUtilization * 0.25; results["machineComponent"] = Number.isFinite(v) ? v : 0; } catch { results["machineComponent"] = 0; }
  try { const v = input.orderAccuracy * 0.2; results["orderComponent"] = Number.isFinite(v) ? v : 0; } catch { results["orderComponent"] = 0; }
  try { const v = -input.defectRate * 0.25; results["defectComponent"] = Number.isFinite(v) ? v : 0; } catch { results["defectComponent"] = 0; }
  try { const v = input.maintenanceCompliance * 0.1; results["maintenanceComponent"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceComponent"] = 0; }
  try { const v = input.safetyScore * 0.1; results["safetyComponent"] = Number.isFinite(v) ? v : 0; } catch { results["safetyComponent"] = 0; }
  try { const v = (results["inventoryComponent"] ?? 0) + (results["machineComponent"] ?? 0) + (results["orderComponent"] ?? 0) + (results["defectComponent"] ?? 0) + (results["maintenanceComponent"] ?? 0) + (results["safetyComponent"] ?? 0); results["timiScore"] = Number.isFinite(v) ? v : 0; } catch { results["timiScore"] = 0; }
  return results;
}


export function calculateTimi_score_calculator(input: Timi_score_calculatorInput): Timi_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["timiScore"] ?? 0;
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


export interface Timi_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

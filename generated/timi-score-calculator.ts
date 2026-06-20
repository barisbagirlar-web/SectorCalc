// Auto-generated from timi-score-calculator-schema.json
import * as z from 'zod';

export interface Timi_score_calculatorInput {
  inventoryTurnover: number;
  machineUtilization: number;
  orderAccuracy: number;
  defectRate: number;
  maintenanceCompliance: number;
  safetyScore: number;
  dataConfidence?: number;
}

export const Timi_score_calculatorInputSchema = z.object({
  inventoryTurnover: z.number().default(5),
  machineUtilization: z.number().default(85),
  orderAccuracy: z.number().default(98),
  defectRate: z.number().default(2),
  maintenanceCompliance: z.number().default(90),
  safetyScore: z.number().default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Timi_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inventoryTurnover * 2.5; results["inventoryComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryComponent"] = Number.NaN; }
  try { const v = input.machineUtilization * 0.25; results["machineComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machineComponent"] = Number.NaN; }
  try { const v = input.orderAccuracy * 0.2; results["orderComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["orderComponent"] = Number.NaN; }
  try { const v = -input.defectRate * 0.25; results["defectComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defectComponent"] = Number.NaN; }
  try { const v = input.maintenanceCompliance * 0.1; results["maintenanceComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maintenanceComponent"] = Number.NaN; }
  try { const v = input.safetyScore * 0.1; results["safetyComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safetyComponent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["inventoryComponent"])) + (toNumericFormulaValue(results["machineComponent"])) + (toNumericFormulaValue(results["orderComponent"])) + (toNumericFormulaValue(results["defectComponent"])) + (toNumericFormulaValue(results["maintenanceComponent"])) + (toNumericFormulaValue(results["safetyComponent"])); results["timiScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timiScore"] = Number.NaN; }
  return results;
}


export function calculateTimi_score_calculator(input: Timi_score_calculatorInput): Timi_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["timiScore"]);
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


export interface Timi_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

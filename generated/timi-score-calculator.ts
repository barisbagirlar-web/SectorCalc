// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Timi_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.inventoryTurnover * 2.5; results["inventoryComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["inventoryComponent"] = 0; }
  try { const v = input.machineUtilization * 0.25; results["machineComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machineComponent"] = 0; }
  try { const v = input.orderAccuracy * 0.2; results["orderComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["orderComponent"] = 0; }
  try { const v = -input.defectRate * 0.25; results["defectComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["defectComponent"] = 0; }
  try { const v = input.maintenanceCompliance * 0.1; results["maintenanceComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maintenanceComponent"] = 0; }
  try { const v = input.safetyScore * 0.1; results["safetyComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyComponent"] = 0; }
  try { const v = (asFormulaNumber(results["inventoryComponent"])) + (asFormulaNumber(results["machineComponent"])) + (asFormulaNumber(results["orderComponent"])) + (asFormulaNumber(results["defectComponent"])) + (asFormulaNumber(results["maintenanceComponent"])) + (asFormulaNumber(results["safetyComponent"])); results["timiScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["timiScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTimi_score_calculator(input: Timi_score_calculatorInput): Timi_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["timiScore"]);
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


export interface Timi_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

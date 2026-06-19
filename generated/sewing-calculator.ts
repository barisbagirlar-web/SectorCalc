// Auto-generated from sewing-calculator-schema.json
import * as z from 'zod';

export interface Sewing_calculatorInput {
  stitchLength: number;
  seamLength: number;
  sewingSpeed: number;
  threadConsumptionFactor: number;
  laborCostPerHour: number;
  machineCostPerHour: number;
  dataConfidence?: number;
}

export const Sewing_calculatorInputSchema = z.object({
  stitchLength: z.number().default(2.5),
  seamLength: z.number().default(100),
  sewingSpeed: z.number().default(1000),
  threadConsumptionFactor: z.number().default(2.5),
  laborCostPerHour: z.number().default(15),
  machineCostPerHour: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sewing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seamLength * 10 / input.stitchLength; results["totalStitches"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStitches"] = 0; }
  try { const v = (asFormulaNumber(results["totalStitches"])) / input.sewingSpeed; results["sewingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sewingTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["sewingTimeMinutes"])) / 60; results["sewingTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sewingTimeHours"] = 0; }
  try { const v = input.seamLength / 100 * input.threadConsumptionFactor; results["threadLengthMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["threadLengthMeters"] = 0; }
  try { const v = (asFormulaNumber(results["sewingTimeHours"])) * input.laborCostPerHour; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["sewingTimeHours"])) * input.machineCostPerHour; results["machineCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["machineCost"] = 0; }
  try { const v = (asFormulaNumber(results["laborCost"])) + (asFormulaNumber(results["machineCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSewing_calculator(input: Sewing_calculatorInput): Sewing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Sewing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

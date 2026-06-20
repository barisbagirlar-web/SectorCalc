// Auto-generated from perc-calculator-schema.json
import * as z from 'zod';

export interface Perc_calculatorInput {
  goodParts: number;
  totalParts: number;
  idealCycleTime: number;
  plannedProductionTime: number;
  downtime: number;
  dataConfidence?: number;
}

export const Perc_calculatorInputSchema = z.object({
  goodParts: z.number().default(1000),
  totalParts: z.number().default(1100),
  idealCycleTime: z.number().default(60),
  plannedProductionTime: z.number().default(28800),
  downtime: z.number().default(3600),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Perc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.plannedProductionTime - input.downtime) / input.plannedProductionTime; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availability"] = Number.NaN; }
  try { const v = (input.idealCycleTime * input.totalParts) / input.plannedProductionTime; results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["performance"] = Number.NaN; }
  try { const v = input.goodParts / input.totalParts; results["quality"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality"] = Number.NaN; }
  try { const v = ((input.plannedProductionTime - input.downtime) / input.plannedProductionTime) * ((input.idealCycleTime * input.totalParts) / input.plannedProductionTime) * (input.goodParts / input.totalParts); results["overallOEE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallOEE"] = Number.NaN; }
  return results;
}


export function calculatePerc_calculator(input: Perc_calculatorInput): Perc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallOEE"]);
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


export interface Perc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from activity-calculator-schema.json
import * as z from 'zod';

export interface Activity_calculatorInput {
  actualOutput: number;
  plannedOutput: number;
  availableTime: number;
  downtime: number;
  cycleTime: number;
  dataConfidence?: number;
}

export const Activity_calculatorInputSchema = z.object({
  actualOutput: z.number().default(0),
  plannedOutput: z.number().default(0),
  availableTime: z.number().default(0),
  downtime: z.number().default(0),
  cycleTime: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Activity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.availableTime - input.downtime; results["actualProductionTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualProductionTime"] = Number.NaN; }
  try { const v = input.actualOutput / (toNumericFormulaValue(results["actualProductionTime"])); results["activityRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activityRate"] = Number.NaN; }
  try { const v = input.actualOutput / input.plannedOutput; results["efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiency"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["actualProductionTime"])) / input.availableTime; results["utilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilization"] = Number.NaN; }
  try { const v = (input.availableTime * 3600) / input.cycleTime; results["theoreticalMaxOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalMaxOutput"] = Number.NaN; }
  try { const v = input.actualOutput / (toNumericFormulaValue(results["theoreticalMaxOutput"])); results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["performance"] = Number.NaN; }
  return results;
}


export function calculateActivity_calculator(input: Activity_calculatorInput): Activity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["activityRate"]);
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


export interface Activity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

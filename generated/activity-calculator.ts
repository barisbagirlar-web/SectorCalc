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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Activity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.availableTime - input.downtime; results["actualProductionTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["actualProductionTime"] = 0; }
  try { const v = input.actualOutput / (asFormulaNumber(results["actualProductionTime"])); results["activityRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["activityRate"] = 0; }
  try { const v = input.actualOutput / input.plannedOutput; results["efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = (asFormulaNumber(results["actualProductionTime"])) / input.availableTime; results["utilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["utilization"] = 0; }
  try { const v = (input.availableTime * 3600) / input.cycleTime; results["theoreticalMaxOutput"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theoreticalMaxOutput"] = 0; }
  try { const v = input.actualOutput / (asFormulaNumber(results["theoreticalMaxOutput"])); results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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

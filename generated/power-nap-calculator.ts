// Auto-generated from power-nap-calculator-schema.json
import * as z from 'zod';

export interface Power_nap_calculatorInput {
  currentTimeMinutes: number;
  deadlineTimeMinutes: number;
  sleepLatencyMinutes: number;
  napQualityGoal: number;
  dataConfidence?: number;
}

export const Power_nap_calculatorInputSchema = z.object({
  currentTimeMinutes: z.number().default(480),
  deadlineTimeMinutes: z.number().default(720),
  sleepLatencyMinutes: z.number().default(10),
  napQualityGoal: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Power_nap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deadlineTimeMinutes - input.currentTimeMinutes; results["availableTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["availableTimeMinutes"] = 0; }
  try { const v = ((((asFormulaNumber(results["availableTimeMinutes"])) >= (20 + input.sleepLatencyMinutes)) && ((asFormulaNumber(results["availableTimeMinutes"])) > 0)) ? 1 : 0); results["powerNapFeasible"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerNapFeasible"] = 0; }
  try { const v = (asFormulaNumber(results["availableTimeMinutes"])) >= (90 + input.sleepLatencyMinutes); results["fullCycleFeasible"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fullCycleFeasible"] = 0; }
  try { const v = (asFormulaNumber(results["fullCycleFeasible"])) && input.napQualityGoal >= 5 ? 90 : ((asFormulaNumber(results["powerNapFeasible"])) ? 20 : 0); results["recommendedNapDuration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recommendedNapDuration"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePower_nap_calculator(input: Power_nap_calculatorInput): Power_nap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["recommendedNapDuration"]));
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


export interface Power_nap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

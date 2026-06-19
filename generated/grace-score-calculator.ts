// Auto-generated from grace-score-calculator-schema.json
import * as z from 'zod';

export interface Grace_score_calculatorInput {
  equipment_age: number;
  utilization: number;
  maintenance_interval: number;
  environment_severity: number;
  last_inspection_score: number;
  operator_experience: number;
  dataConfidence?: number;
}

export const Grace_score_calculatorInputSchema = z.object({
  equipment_age: z.number().default(10),
  utilization: z.number().default(8),
  maintenance_interval: z.number().default(90),
  environment_severity: z.number().default(3),
  last_inspection_score: z.number().default(80),
  operator_experience: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grace_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input.utilization / 24) * 0.4; results["util_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["util_factor"] = 0; }
  try { const v = 1 + (1 - (input.maintenance_interval / 365)) * 0.3; results["maint_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maint_factor"] = 0; }
  try { const v = 1 - (input.environment_severity - 1) * 0.1; results["env_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["env_factor"] = 0; }
  try { const v = input.last_inspection_score / 100; results["insp_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["insp_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrace_score_calculator(input: Grace_score_calculatorInput): Grace_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["insp_factor"]));
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


export interface Grace_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
